export interface SharedTargetDraft {
  file: File | null;
  title: string;
  text: string;
  url: string;
  receivedAt: number;
}

interface StoredShareTargetRecord {
  id: string;
  fileBlob: Blob | null;
  fileName?: string;
  fileType?: string;
  title?: string;
  text?: string;
  url?: string;
  receivedAt?: number;
}

const SHARE_TARGET_DB_NAME = 'fsp_share_target_db';
const SHARE_TARGET_STORE_NAME = 'shared_items';
const MAX_DRAFT_AGE_MS = 24 * 60 * 60 * 1000;

function openShareTargetDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(SHARE_TARGET_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(SHARE_TARGET_STORE_NAME)) {
        db.createObjectStore(SHARE_TARGET_STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function readSharedTargetPayload(): Promise<SharedTargetDraft | null> {
  try {
    const db = await openShareTargetDb();
    const record = await new Promise<StoredShareTargetRecord | undefined>(
      (resolve, reject) => {
        const tx = db.transaction(SHARE_TARGET_STORE_NAME, 'readonly');
        const req = tx.objectStore(SHARE_TARGET_STORE_NAME).get('latest');
        req.onsuccess = () => {
          resolve(req.result as StoredShareTargetRecord | undefined);
        };
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
        tx.onerror = () => db.close();
      }
    );

    if (!record) return null;
    const receivedAt = record.receivedAt || Date.now();
    if (Date.now() - receivedAt > MAX_DRAFT_AGE_MS) {
      await clearSharedTargetPayload();
      return null;
    }

    let reconstructedFile: File | null = null;
    if (record.fileBlob && record.fileBlob.size > 0) {
      const mimeType =
        record.fileType || record.fileBlob.type || 'image/jpeg';
      const fileName = record.fileName || 'shared-flyer.jpg';
      reconstructedFile = new File([record.fileBlob], fileName, {
        type: mimeType
      });
    }

    if (
      !reconstructedFile &&
      !record.title?.trim() &&
      !record.text?.trim() &&
      !record.url?.trim()
    ) {
      return null;
    }

    return {
      file: reconstructedFile,
      title: (record.title || '').trim(),
      text: (record.text || '').trim(),
      url: (record.url || '').trim(),
      receivedAt
    };
  } catch {
    return null;
  }
}

export async function clearSharedTargetPayload(): Promise<void> {
  try {
    const db = await openShareTargetDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(SHARE_TARGET_STORE_NAME, 'readwrite');
      tx.objectStore(SHARE_TARGET_STORE_NAME).delete('latest');
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // Ignore storage cleanup error
  }
}

export function subscribeShareTargetBroadcast(
  onReceive: () => void
): () => void {
  if (typeof BroadcastChannel === 'undefined') {
    return () => {};
  }
  try {
    const channel = new BroadcastChannel('fsp-share-target');
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_SHARED_TARGET') {
        onReceive();
      }
    };
    channel.addEventListener('message', handler);
    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
  } catch {
    return () => {};
  }
}
