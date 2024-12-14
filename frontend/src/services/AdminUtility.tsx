const API_URL = '/api/db_query';

export const fetchTableData = async (table: string) => {
  const response = await fetch(`${API_URL}?action=read&table=${table}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

export const createEntry = async (table: string, data: Record<string, string | number>) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', table: table, ...data}),
  });
  if (!response.ok) throw new Error('Failed to create entry');
  return response.json();
};

export const updateEntry = async (table: string, primary_key: string, id: number, field: string, value: number | string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update',
      table: table,
      [primary_key]: id, 
      [field]: value
    }),
  });
  if (!response.ok) throw new Error('Failed to update entry');
  return response.json();
};

export const deleteEntry = async (table: string, primary_key: string, id: number) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete',
      table: table,
      [primary_key]: id
    }),
  });
  if (!response.ok) throw new Error('Failed to delete entry');
  return response.json();
};

export const reorderKeys = (keys: string[], primaryKey: string): string[] => {
  const index = keys.indexOf(primaryKey);
  if (index > -1) {
    keys.splice(index, 1);
    keys.unshift(primaryKey);
  }
  return keys;
};
