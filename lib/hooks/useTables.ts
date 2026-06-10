'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseConfig';
import { Table, Column } from '@/lib/types/gridly';

export const useTables = (baseId: string | null) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baseId) {
      setTables([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'bases', baseId, 'tables'),
      where('baseId', '==', baseId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tablesData: Table[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Table[];
        setTables(tablesData.sort((a, b) => a.createdAt - b.createdAt));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [baseId]);

  const createTable = async (tableName: string, userId: string) => {
    if (!baseId) throw new Error('Base not selected');

    try {
      const defaultColumns: Column[] = [
        {
          id: 'col_1',
          name: 'Name',
          type: 'text',
          createdAt: Date.now(),
        },
      ];

      const newTable = await addDoc(
        collection(db, 'bases', baseId, 'tables'),
        {
          name: tableName,
          baseId,
          columns: defaultColumns,
          recordCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          createdBy: userId,
        }
      );

      return newTable.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTable = async (tableId: string) => {
    if (!baseId) throw new Error('Base not selected');

    try {
      const recordsSnapshot = await getDocs(
        collection(db, 'bases', baseId, 'tables', tableId, 'records')
      );

      const batch = writeBatch(db);

      recordsSnapshot.docs.forEach((record) => {
        batch.delete(record.ref);
      });

      batch.delete(doc(db, 'bases', baseId, 'tables', tableId));
      await batch.commit();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTable = async (tableId: string, updates: Partial<Table>) => {
    if (!baseId) throw new Error('Base not selected');

    try {
      await updateDoc(doc(db, 'bases', baseId, 'tables', tableId), {
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { tables, loading, error, createTable, deleteTable, updateTable };
};
