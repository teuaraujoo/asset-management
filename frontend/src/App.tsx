import "./App.css"
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        // gutter={12}
        containerStyle={{
          zIndex: 200000
        }}
        toastOptions={{
          duration: 4000,

          style: {
            background: "#FAFAFA",
            color: "#131313",
            border: "1px solid #155efc13",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "14px 16px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.15)",
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: "#22C55E",
              secondary: "#FFFFFF",
            },
          },

          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },

          loading: {
            duration: Infinity,
          },
        }}
      />
    </BrowserRouter>
  );
};