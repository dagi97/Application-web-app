'use client'
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/lib/redux/hooks";
import { useCreateCycleMutation } from "@/lib/redux/api/adminApi";
import { useState } from "react";
import AdminNav from '@/app/components/navigation/AdminNav';

type FormValue = {
  cycle_name: string;
  country: string;
  start_date: string;
  end_date: string;
};

export default function CreateCycle() {
  const [createCycle, { isLoading }] = useCreateCycleMutation();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValue>({
    mode: "onChange",
    defaultValues: {
      country: "",
    },
  });

  const onSubmit = async (data: FormValue) => {
    setSubmitSuccess(false);
    setSubmitError(null);
    
    try {
      const payload = {
        name: data.cycle_name,
        start_date: data.start_date,
        end_date: data.end_date,
      };

      const response = await createCycle({
        body: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }).unwrap();
      if (response.success !== false) {
        reset();
        setSubmitSuccess(true);
      } else {
        throw new Error(response.message || "Failed to create cycle");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      let errorMessage = "Failed to create cycle. Please try again.";
      
      if (err.data) {
        errorMessage = err.data.message || 
                       err.data.error || 
                       JSON.stringify(err.data);
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.status === 'FETCH_ERROR') {
        errorMessage = "Network error. Please check your connection.";
      }

      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-[1920px] p-4 md:p-10">
      <AdminNav/>
      <div className="flex flex-col gap-2 mb-6 md:mb-10">
        <h1 className="text-xl md:text-2xl font-bold">Create new cycle</h1>
        <p className="text-sm md:text-base text-gray-600">
          Use this form to create a new cycle and assign periods.
        </p>
      </div>

      <div className="w-full max-w-[1216px] p-4 md:p-6 rounded-lg bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Cycle name
              </label>
              <input
                type="text"
                className={`w-full h-9 md:h-10 px-3 py-1 md:py-2 border ${
                  errors.cycle_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                {...register("cycle_name", { required: "Cycle name is required" })}
                placeholder="Enter cycle name"
              />
              {errors.cycle_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cycle_name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                className={`w-full h-9 md:h-10 px-3 py-1 md:py-2 border ${
                  errors.country ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                {...register("country", { required: "Country is required" })}
              >
                <option value="" disabled>Select a country</option>
                <option value="ethiopia">Ethiopia</option>
                <option value="kenya">Kenya</option>
                <option value="nigeria">Nigeria</option>
                <option value="ghana">Ghana</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Start date
              </label>
              <input
                type="date"
                className={`w-full h-9 md:h-10 px-3 py-1 md:py-2 border ${
                  errors.start_date ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                {...register("start_date", { required: "Start date is required" })}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                End date
              </label>
              <input
                type="date"
                className={`w-full h-9 md:h-10 px-3 py-1 md:py-2 border ${
                  errors.end_date ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                {...register("end_date", {
                  required: "End date is required",
                  validate: (value, { start_date }) => {
                    if (start_date && value <= start_date) {
                      return "End date must be after start date";
                    }
                    return true;
                  },
                })}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {submitError}
            </div>
          )}

          {submitSuccess && !isLoading && !submitError && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Cycle created successfully!
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                reset();
                setSubmitError(null);
                setSubmitSuccess(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Cycle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}