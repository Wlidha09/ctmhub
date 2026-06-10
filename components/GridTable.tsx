'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Column, Record as GridlyRecord } from '@/lib/types/gridly';
import { GridCell } from './GridCell';

interface GridTableProps {
  columns: Column[];
  records: GridlyRecord[];
  loading: boolean;
  onAddRow: () => Promise<void>;
  onDeleteRow: (recordId: string) => Promise<void>;
  onUpdateCell: (recordId: string, cellData: Record<string, any>) => Promise<void>;
  onAddColumn: (columnName: string, columnType: string, options?: string[]) => Promise<void>;
  onDeleteColumn: (columnId: string) => Promise<void>;
}

interface EditingCell {
  recordId: string;
  columnId: string;
}

export const GridTable: React.FC<GridTableProps> = ({
  columns,
  records,
  loading,
  onAddRow,
  onDeleteRow,
  onUpdateCell,
  onAddColumn,
  onDeleteColumn,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [rowBeingDeleted, setRowBeingDeleted] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<string>('text');
  const [newColumnOptions, setNewColumnOptions] = useState('');

  const handleSaveCell = useCallback(
    async (recordId: string, columnId: string, value: any) => {
      const record = records.find((r) => r.id === recordId);
      if (!record) return;

      const updatedData = { ...record.data, [columnId]: value };
      await onUpdateCell(recordId, updatedData);
      setEditingCell(null);
    },
    [records, onUpdateCell]
  );

  const handleAddColumn = useCallback(async () => {
    if (!newColumnName.trim()) return;

    const options =
      newColumnType === 'select'
        ? newColumnOptions.split(',').map((opt) => opt.trim())
        : undefined;

    await onAddColumn(newColumnName, newColumnType, options);
    setNewColumnName('');
    setNewColumnType('text');
    setNewColumnOptions('');
    setAddingColumn(false);
  }, [newColumnName, newColumnType, newColumnOptions, onAddColumn]);

  const displayRecords = useMemo(() => {
    return records.slice(0, 500);
  }, [records]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-12 px-3 py-3 text-center border-r border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700">
              #
            </th>

            {columns.map((column) => (
              <th
                key={column.id}
                className="px-4 py-3 text-left border-r border-gray-200 text-sm font-semibold text-gray-900 min-w-[150px]"
              >
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span>{column.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {column.type}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteColumn(column.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600"
                    title="Delete column"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </th>
            ))}

            <th className="px-4 py-3 text-left border-r border-gray-200 w-12">
              <button
                onClick={() => setAddingColumn(!addingColumn)}
                className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-gray-600"
                title="Add column"
              >
                <Plus size={16} />
              </button>
            </th>

            <th className="w-12 px-3 py-3 text-center border-gray-200 bg-gray-100"></th>
          </tr>

          {addingColumn && (
            <tr className="border-b border-gray-200 bg-blue-50">
              <td colSpan={columns.length + 3} className="px-4 py-3">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-700">Column Name</label>
                    <input
                      type="text"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded mt-1 text-sm"
                      placeholder="e.g., Status"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Type</label>
                    <select
                      value={newColumnType}
                      onChange={(e) => setNewColumnType(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded mt-1 text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                  {newColumnType === 'select' && (
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-700">Options (comma-separated)</label>
                      <input
                        type="text"
                        value={newColumnOptions}
                        onChange={(e) => setNewColumnOptions(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded mt-1 text-sm"
                        placeholder="Option 1, Option 2"
                      />
                    </div>
                  )}
                  <button
                    onClick={handleAddColumn}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingColumn(false);
                      setNewColumnName('');
                      setNewColumnType('text');
                      setNewColumnOptions('');
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}
        </thead>

        <tbody>
          {displayRecords.map((record, index) => (
            <tr
              key={record.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-2 text-center border-r border-gray-200 text-xs text-gray-500 bg-gray-50 font-medium">
                {index + 1}
              </td>

              {columns.map((column) => (
                <td
                  key={`${record.id}-${column.id}`}
                  className="px-0 py-0 border-r border-gray-200"
                >
                  <GridCell
                    columnId={column.id}
                    recordId={record.id}
                    value={record.data[column.id]}
                    column={column}
                    isEditing={
                      editingCell?.recordId === record.id &&
                      editingCell?.columnId === column.id
                    }
                    onStartEdit={() => setEditingCell({ recordId: record.id, columnId: column.id })}
                    onSave={handleSaveCell}
                    onCancel={() => setEditingCell(null)}
                  />
                </td>
              ))}

              <td className="border-r border-gray-200 px-4 py-2"></td>

              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => setRowBeingDeleted(record.id)}
                  className="opacity-0 hover:opacity-100 transition-opacity inline-flex items-center justify-center p-1 hover:bg-red-100 rounded text-red-600"
                  title="Delete row"
                >
                  <Trash2 size={14} />
                </button>

                {rowBeingDeleted === record.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-sm">
                      <h3 className="font-semibold text-gray-900 mb-4">Delete row?</h3>
                      <p className="text-gray-600 mb-6 text-sm">This action cannot be undone.</p>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setRowBeingDeleted(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            onDeleteRow(record.id);
                            setRowBeingDeleted(null);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onAddRow}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Row
          </button>
        </div>
      )}
    </div>
  );
};
