import React from "react";
import { CheckCircle } from "lucide-react";
import Button from "./Button";

const ActionSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center text-center space-y-4">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <h1 className="text-2xl font-extrabold text-gray-900">
          Action Successful!
        </h1>
        <p className="text-sm text-gray-600">
          Your password has been reset. You can now log in with your new
          <span className="block">password.</span>
        </p>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default ActionSuccess;
