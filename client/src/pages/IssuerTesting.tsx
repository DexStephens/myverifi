export default function IssuerTesting() {
  return (
    <div>
      <div>
        <h1>Testing Issuer Issuance Page</h1>
        <p>This is the page where an issuer (like BYU or CompTIA) would come to issue a credential to a user.</p>
      </div>
      <br />

      <div>
        <h1>Issue Credential</h1>

        <div>
          <h3>Credential Info</h3>

          <h4>Degree Type</h4>
          <select>
            <option value="bach">Bachelor's Degree</option>
            <option value="mast">Master's Degree</option>
          </select>
          <br />

          <h4>Degree Field</h4>
          <select>
            <option value="cs">Computer Science</option>
            <option value="ee">Electrical Engineering</option>
            <option value="ubw">Underwater Basket Weaving</option>
          </select>
        </div>
      </div>
    </div>
  );
};
