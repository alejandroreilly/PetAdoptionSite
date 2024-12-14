import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import { fetchTableData, createEntry, updateEntry, deleteEntry, reorderKeys } from '../services/AdminUtility';

const PRIMARY_KEYS: Record<string, string> = {
  pets: 'pet_id',
  users: 'user_id',
  applications: 'application_id',
  visits: 'visit_id',
};

interface TableRow {
  [key: string]: string | number;
}

const AdminDB: React.FC = () => {
  const [currentTable, setCurrentTable] = useState<string>('pets');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [newEntry, setNewEntry] = useState<Record<string, string | number>>({});
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setFilteredData([]); // Reset filteredData when changing table
    loadTableData(); // Load the new table data
  }, [currentTable]);

  const loadTableData = async () => {
    try {
      const data = await fetchTableData(currentTable);
      setTableData(data);
      setFilteredData(data);

      // Initialize a blank new entry with fields based on the current table structure
      if (data.length > 0) {
        const blankEntry: Record<string, string | number> = {};
        Object.keys(data[0]).forEach((key) => {
          blankEntry[key] = '';
        });
        setNewEntry(blankEntry);
      }
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error loading table data');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(
      tableData.filter((row) =>
        Object.values(row).some((value) =>
          value !== null && value !== undefined && value.toString().toLowerCase().includes(query)
        )
      )
    );
  };

  const handleNewEntryChange = (key: string, value: number | string) => {
    setNewEntry((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      const primaryKey = PRIMARY_KEYS[currentTable];
      const filteredEntry = Object.fromEntries(
        Object.entries(newEntry).filter(([key]) => key !== primaryKey)
      );
  
      await createEntry(currentTable, filteredEntry);

      setNewEntry((prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, key === primaryKey ? '' : '']))
      );
  
      loadTableData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error adding entry');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };  

  const handleUpdate = async (primary_key: string, id: number, field: string, value: number | string) => {
    try {
      await updateEntry(currentTable, primary_key, id, field, value);
      loadTableData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error updating entry');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (id: number, primary_key: string) => {
    try {
      await deleteEntry(currentTable, primary_key, id);
      loadTableData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error deleting entry');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>Admin DB Management</h2>
        </Col>
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button onClick={() => setCurrentTable('pets')}>Pets</Button>
          <Button onClick={() => setCurrentTable('users')}>Users</Button>
          <Button onClick={() => setCurrentTable('applications')}>Applications</Button>
          <Button onClick={() => setCurrentTable('visits')}>Visits</Button>
        </Col>
      </Row>
      {error && <p className="text-danger">{error}</p>}
  
      {/* Create New Entry Table */}
      <Table bordered hover>
        <thead>
          <tr>
            {(() => {
              const primaryKey = PRIMARY_KEYS[currentTable];
              const headers = Object.keys(newEntry);
              const orderedKeys = reorderKeys(headers, primaryKey);
              return orderedKeys.map((key) => (
                <th key={key}>{key === primaryKey ? `${key} (Primary Key)` : key}</th>
              ));
            })()}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {(() => {
              const primaryKey = PRIMARY_KEYS[currentTable];
              const keys = reorderKeys(Object.keys(newEntry), primaryKey);
              return keys.map((key) =>
                key === primaryKey ? (
                  <td key={key} />
                ) : (
                  <td key={key}>
                    <FormControl
                      placeholder={`Enter ${key}`}
                      value={newEntry[key] || ''}
                      onChange={(e) => handleNewEntryChange(key, e.target.value)}
                    />
                  </td>
                )
              );
            })()}
            <td>
              <Button variant="success" onClick={handleCreate}>
                Add New Entry
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
  
      {/* Manage Data Table (Read, Update, Delete) */}
      <Table bordered hover>
        <thead>
          <tr>
            {(() => {
              const primaryKey = PRIMARY_KEYS[currentTable];
              const headers = Object.keys(filteredData[0] || {});
              const orderedKeys = reorderKeys(headers, primaryKey);
              return orderedKeys.map((key) => (
                <th key={key}>{key === primaryKey ? `${key} (Primary Key)` : key}</th>
              ));
            })()}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Check if filteredData is empty */}
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={Object.keys(filteredData[0] || {}).length + 1} className="text-center">
                No data available
              </td>
            </tr>
          ) : (
            // Existing Data Rows
            filteredData.map((row) => {
              const primaryKey = PRIMARY_KEYS[currentTable];
              const id = row[primaryKey] as number;
    
              const keys = reorderKeys(Object.keys(row), primaryKey);
    
              return (
                <tr key={id}>
                  {keys.map((key) => (
                    <td
                      key={key}
                      contentEditable={key !== primaryKey}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUpdate(primaryKey, id, key, e.currentTarget.textContent || '')
                      }
                    >
                      {row[key]}
                    </td>
                  ))}
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(id, primaryKey)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDB;
