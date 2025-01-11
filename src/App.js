// App.js
import React, { useState } from "react";
import "./App.css";

const initialData = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1500,
    children: [
      { id: "phones", label: "Phones", value: 800 },
      { id: "laptops", label: "Laptops", value: 700 },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000,
    children: [
      { id: "tables", label: "Tables", value: 300 },
      { id: "chairs", label: "Chairs", value: 700 },
    ],
  },
];

function App() {
  const [data, setData] = useState(initialData);

  const updateChildValues = (parent, newValue) => {
    const totalValue = parent.children.reduce((sum, child) => sum + child.value, 0);
    const ratio = newValue / totalValue;

    return parent.children.map((child) => ({
      ...child,
      value: parseFloat((child.value * ratio).toFixed(2)),
    }));
  };

  const handleValueUpdate = (id, type, inputValue) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        const originalValue = item.value;
        const newValue =
          type === "percentage"
            ? originalValue + (originalValue * inputValue) / 100
            : inputValue;

        const updatedChildren = item.children
          ? updateChildValues(item, newValue)
          : item.children;

        return {
          ...item,
          value: newValue,
          children: updatedChildren,
        };
      } else if (item.children) {
        const updatedChildren = item.children.map((child) => {
          if (child.id === id) {
            const originalValue = child.value;
            const newValue =
              type === "percentage"
                ? originalValue + (originalValue * inputValue) / 100
                : inputValue;

            return {
              ...child,
              value: newValue,
            };
          }
          return child;
        });

        const updatedParentValue = updatedChildren.reduce(
          (sum, child) => sum + child.value,
          0
        );

        return {
          ...item,
          value: updatedParentValue,
          children: updatedChildren,
        };
      }
      return item;
    });

    setData(newData);
  };

  const calculateVariance = (original, updated) => {
    return ((updated - original) / original) * 100;
  };

  const renderRows = (rows, originalData = initialData) => {
    return rows.map((row) => {
      const originalRow = originalData.find((item) => item.id === row.id) || {};
      const variance = calculateVariance(originalRow.value || row.value, row.value);

      return (
        <React.Fragment key={row.id}>
          <tr>
            <td>{row.label}</td>
            <td>{row.value.toFixed(2)}</td>
            <td>
              <input
                type="number"
                placeholder="Enter value"
                onChange={(e) => (row.input = e.target.value)}
              />
            </td>
            <td>
              <button
                onClick={() =>
                  handleValueUpdate(row.id, "percentage", parseFloat(row.input || 0))
                }
              >
                Allocation %
              </button>
            </td>
            <td>
              <button
                onClick={() =>
                  handleValueUpdate(row.id, "value", parseFloat(row.input || 0))
                }
              >
                Allocation Val
              </button>
            </td>
            <td>{variance.toFixed(2)}%</td>
          </tr>
          {row.children && (
            <tr>
              <td colSpan="6">
                <table>{renderRows(row.children, originalRow.children)}</table>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  };

  const grandTotal = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="App">
      <h1>Hierarchical Table</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {renderRows(data)}
          <tr>
            <td>Grand Total</td>
            <td>{grandTotal.toFixed(2)}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
