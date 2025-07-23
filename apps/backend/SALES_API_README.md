# Sales Dashboard API

This API serves sales data from the `sales-records.csv` file with filtering, pagination, and analytics capabilities.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. Get Sales Records

**GET** `/sales`

Retrieve sales records with optional filtering and pagination.

**Query Parameters:**

- `region` (string, optional): Filter by region (case-insensitive partial match)
- `country` (string, optional): Filter by country (case-insensitive partial match)
- `itemType` (string, optional): Filter by item type (case-insensitive partial match)
- `salesChannel` (string, optional): Filter by sales channel (case-insensitive partial match)
- `orderPriority` (string, optional): Filter by order priority (exact match: H, M, L)
- `startDate` (string, optional): Filter by order date (format: MM/DD/YYYY)
- `endDate` (string, optional): Filter by order date (format: MM/DD/YYYY)
- `limit` (number, optional): Number of records to return (default: 100, max: 1000)
- `offset` (number, optional): Number of records to skip (default: 0)

**Example:**

```bash
curl "http://localhost:3000/api/sales?region=Europe&limit=5"
```

**Response:**

```json
{
  "data": [
    {
      "Region": "Europe",
      "Country": "Iceland",
      "Item Type": "Baby Food",
      "Sales Channel": "Online",
      "Order Priority": "H",
      "Order Date": "11/20/2010",
      "Order ID": "599480426",
      "Ship Date": "1/9/2011",
      "Units Sold": 8435,
      "Unit Price": 255.28,
      "Unit Cost": 159.42,
      "Total Revenue": 2153286.8,
      "Total Cost": 1344707.7,
      "Total Profit": 808579.1
    }
  ],
  "total": 12841,
  "limit": 5,
  "offset": 0
}
```

### 2. Get Sales Summary

**GET** `/sales/summary`

Get overall statistics and available filter options.

**Example:**

```bash
curl "http://localhost:3000/api/sales/summary"
```

**Response:**

```json
{
  "totalRecords": 50000,
  "totalRevenue": 66185806881.22,
  "totalProfit": 19527936948.25,
  "regions": ["Sub-Saharan Africa", "Europe", "Asia", ...],
  "countries": ["Namibia", "Iceland", "Russia", ...],
  "itemTypes": ["Household", "Baby Food", "Meat", ...],
  "salesChannels": ["Offline", "Online"]
}
```

### 3. Get Sales by Region

**GET** `/sales/by-region`

Get aggregated sales data grouped by region.

**Example:**

```bash
curl "http://localhost:3000/api/sales/by-region"
```

**Response:**

```json
[
  {
    "region": "Sub-Saharan Africa",
    "revenue": 17380963209.03,
    "profit": 5115635324.69,
    "count": 13116
  },
  {
    "region": "Europe",
    "revenue": 16841485204.42,
    "profit": 4989882518.57,
    "count": 12841
  }
]
```

### 4. Get Sales by Item Type

**GET** `/sales/by-item-type`

Get aggregated sales data grouped by item type.

**Example:**

```bash
curl "http://localhost:3000/api/sales/by-item-type"
```

**Response:**

```json
[
  {
    "itemType": "Household",
    "revenue": 13723463075.62,
    "profit": 3403399128.38,
    "count": 4139
  },
  {
    "itemType": "Baby Food",
    "revenue": 5179594439.68,
    "profit": 1944985596.16,
    "count": 4078
  }
]
```

## Data Structure

Each sales record contains the following fields:

- `Region`: Geographic region
- `Country`: Country name
- `Item Type`: Product category
- `Sales Channel`: Online or Offline
- `Order Priority`: H (High), M (Medium), L (Low)
- `Order Date`: Date when order was placed (format: MM/DD/YYYY)
- `Order ID`: Unique order identifier
- `Ship Date`: Date when order was shipped (format: MM/DD/YYYY)
- `Units Sold`: Number of units sold
- `Unit Price`: Price per unit
- `Unit Cost`: Cost per unit
- `Total Revenue`: Total revenue for the order
- `Total Cost`: Total cost for the order
- `Total Profit`: Total profit for the order

## Features

- **Filtering**: Filter by region, country, item type, sales channel, order priority, and date range
- **Pagination**: Limit and offset support for large datasets
- **Analytics**: Pre-calculated summaries by region and item type
- **Performance**: CSV data is loaded once and cached in memory
- **Error Handling**: Proper error responses for invalid requests
- **Real-time Processing**: All filtering and aggregation happens in real-time

## Additional Examples

### Filter by Multiple Criteria

```bash
curl "http://localhost:3000/api/sales?region=Europe&itemType=Meat&salesChannel=Online&limit=5"
```

### Date Range Filtering

```bash
curl "http://localhost:3000/api/sales?startDate=1/1/2015&endDate=12/31/2015&limit=10"
```

### Pagination

```bash
curl "http://localhost:3000/api/sales?limit=20&offset=100"
```

### High Priority Orders

```bash
curl "http://localhost:3000/api/sales?orderPriority=H&limit=10"
```

## Running the API

1. Start the backend server:

   ```bash
   nx serve backend
   ```

2. The API will be available at `http://localhost:3000/api`

3. The CSV file is automatically loaded from `src/assets/data/sales-records.csv`
