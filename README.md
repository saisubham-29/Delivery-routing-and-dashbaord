<h1>Delivery Route Optimus</h1>
<p><strong>Smart Delivery Clustering and Driver Assignment System</strong></p>

<hr/>

<h2>Overview</h2>
<p>
Delivery Route Optimus is a delivery optimization system designed to intelligently
cluster delivery orders and assign them to drivers in a balanced, priority-aware manner.
The system supports both geographical and postal-code-based clustering strategies,
making it suitable for real-world last-mile delivery operations.
</p>

<h2>Objectives</h2>
<ul>
  <li>Optimize delivery assignments using clustering algorithms</li>
  <li>Balance workload across delivery drivers</li>
  <li>Respect delivery priority levels</li>
  <li>Operate with or without GPS coordinate data</li>
  <li>Scale efficiently for large datasets</li>
  <li>Enable CSV-based data integration</li>
</ul>

<h2>Key Features</h2>
<ul>
  <li>Pincode-based clustering (default)</li>
  <li>Distance-based clustering using GPS coordinates</li>
  <li>Priority-aware delivery assignment</li>
  <li>Driver capacity enforcement</li>
  <li>Flexible CSV import support</li>
  <li>Standardized CSV export</li>
  <li>Modular and extensible architecture</li>
</ul>

<h2>Data Models</h2>

<h3>DeliveryData</h3>
<pre>
interface DeliveryData {
  address: string;
  customerId: string;
  pincode: string;
  cylinderType: string;
  priority?: "High" | "Medium" | "Low";
  latitude?: number;
  longitude?: number;
}
</pre>

<h3>AssignedDelivery</h3>
<pre>
interface AssignedDelivery extends DeliveryData {
  driver: string;
  vehicle: string;
  id: string;
}
</pre>

<h2>Clustering Strategies</h2>

<h3>Pincode-Based Clustering</h3>
<p>
Deliveries are sorted by priority and grouped by postal code. Each group is
sequentially assigned to drivers while ensuring that no driver exceeds the
maximum delivery capacity.
</p>

<p><strong>Recommended when:</strong></p>
<ul>
  <li>GPS data is unavailable</li>
  <li>Processing large datasets</li>
  <li>Operating in urban areas with structured postal zones</li>
</ul>

<h3>Distance-Based Clustering</h3>
<p>
Deliveries are clustered based on geographical proximity using latitude and longitude.
Distances are calculated using the Haversine formula and grouped within a configurable radius.
</p>

<p><strong>Recommended when:</strong></p>
<ul>
  <li>GPS coordinates are available</li>
  <li>Fuel and travel time optimization is required</li>
  <li>Operating in rural or geographically irregular regions</li>
</ul>

<h2>Priority Handling</h2>
<p>
Deliveries are processed in the following priority order:
</p>
<ul>
  <li>High</li>
  <li>Medium (default)</li>
  <li>Low</li>
</ul>

<h2>Driver Assignment Rules</h2>
<ul>
  <li>Maximum deliveries per driver: 35</li>
  <li>Drivers are assigned sequentially (Driver 1, Driver 2, etc.)</li>
  <li>Each driver is mapped to a unique vehicle</li>
  <li>Delivery IDs are auto-generated in a standardized format</li>
</ul>

<h2>Performance Characteristics</h2>

<table>
  <thead>
    <tr>
      <th>Clustering Method</th>
      <th>Time Complexity</th>
      <th>Space Complexity</th>
      <th>Recommended Use</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pincode-Based</td>
      <td>O(n log n)</td>
      <td>O(n)</td>
      <td>Large datasets</td>
    </tr>
    <tr>
      <td>Distance-Based</td>
      <td>O(n²)</td>
      <td>O(n)</td>
      <td>Moderate datasets with GPS</td>
    </tr>
  </tbody>
</table>

<h2>CSV Integration</h2>

<h3>Input</h3>
<p>
The system supports flexible CSV headers for addresses, customer identifiers,
priority values, and geographic coordinates.
</p>

<h3>Output</h3>
<pre>
Delivery ID, Address, Customer ID, Pincode, Cylinder Type,
Priority, Latitude, Longitude, Driver, Vehicle
</pre>

<h2>Error Handling</h2>
<ul>
  <li>Missing GPS coordinates are handled gracefully</li>
  <li>Invalid or missing priority values default to Medium</li>
  <li>Empty datasets return empty results without failure</li>
</ul>

<h2>Future Enhancements</h2>
<ul>
  <li>Dynamic cluster radius based on delivery density</li>
  <li>Traffic-aware clustering</li>
  <li>Multi-objective optimization</li>
  <li>Machine learning-based parameter tuning</li>
  <li>Route sequencing optimization within clusters</li>
</ul>

<hr/>

<p>
This project provides a scalable and extensible foundation for modern
delivery and logistics optimization systems.
</p>
