import { Routes, Route } from "react-router";

import DrdoDashboard from "./DrdoDashboard";
import DrdoPortal from "./DrdoPortal";
import ModifyAssetRecord from "./ModifyAssetRecord";

import "./App.css";
import DeleteAssetRecord from "./DeleteAssetRecord";
import AdminDashboard from "./AdminDashboard";
import AddAssetRecord from "./AddAssetRecord";


function PagePlaceholder({ title }) {

  return (

    <div className="placeholder-page">

      <div className="placeholder-card">

        <h1>{title}</h1>

        <p>
          This page is ready for implementation.
        </p>

        <button
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

      </div>

    </div>

  );
}


function App() {

  return (

    <Routes>

      {/* DASHBOARD */}

      <Route
        path="/DrdoDashboard"
        element={<DrdoDashboard />}
      />


      {/* PROFILE */}

      <Route
        path="/profile"
        element={
          <PagePlaceholder
            title="Profile Details"
          />
        }
      />

<Route
        path="/DeleteAssetRecord"
        element={
          <DeleteAssetRecord
            title="Delete Asset Record"
          />
        }
      />


      {/* LOGOUT */}

      <Route
        path="/"
        element={
          <DrdoPortal
            title="Logout / Login Area"
          />
        }
      />


      {/* ADD RECORD */}

      <Route
        path="/add-record"
        element={
          <AddAssetRecord
            title="Add New Record"
          />
        }
      />


      {/* MODIFY */}

      <Route
        path="/ModifyAssetRecord"
        element={
          <ModifyAssetRecord
            title="Modify Asset Record"
          />
        }
      />


      {/* DELETE */}

      <Route
        path="/delete-data"
        element={
          <PagePlaceholder
            title="Delete Data Records"
          />
        }
      />


      {/* SEARCH */}

      <Route
        path="/search"
        element={
          <PagePlaceholder
            title="Search Results"
          />
        }
      />


      {/* 404 */}

      <Route
        path="*"
        element={
          <PagePlaceholder
            title="404 - Page Not Found"
          />
        }
      />
      <Route path="/AdminDashboard"
      element={<AdminDashboard/>}/>
    </Routes>

  );

}

export default App;