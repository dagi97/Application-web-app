"use client";
import { useEffect, useState, use } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUpdateCycleMutation } from "@/lib/redux/api/adminApi";
import { useSession } from "next-auth/react";
import AdminNav from "@/app/components/navigation/AdminNav";
import Footer_Variant1 from "@/app/components/footer/footer_variant1";

type FormData = {
  name: string;
  start_date: string;
  end_date: string;
};

interface Props {
  params: Promise<{ cycle_id: string }>;
}

export default function CycleUpdate({ params }: Props) {
  const { cycle_id } = use(params);
  const { data: session } = useSession();
  const accessToken = session?.access;
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updateCycle] = useUpdateCycleMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>();

  // Fetch cycle data and populate form
  useEffect(() => {
    async function fetchCycle() {
      try {
        const response = await fetch(
          `https://a2sv-application-platform-backend-team2.onrender.com/cycles/${cycle_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cycle data");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("No cycle data found");
        }

        const cycleData = result.data;
        reset({
          name: cycleData.name,
          start_date: cycleData.start_date.split("T")[0],
          end_date: cycleData.end_date.split("T")[0],
        });
      } catch (err: any) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      fetchCycle();
    }
  }, [cycle_id, accessToken, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setFetchError(null);
      setSubmitSuccess(false);

      const result = await updateCycle({
        id: cycle_id,
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
      }).unwrap();

      if (result.success) {
        setSubmitSuccess(true);
        // Update form with new values
        setValue("name", result.data.name);
        setValue("start_date", result.data.start_date.split("T")[0]);
        setValue("end_date", result.data.end_date.split("T")[0]);
        setTimeout(() => {
          router.push("/admin/cycle");
        }, 2000);
      }
    } catch (err: any) {
      setFetchError(
        err.data?.message ||
          err.message ||
          "Failed to update cycle. Please try again."
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (fetchError)
    return (
      <div className="p-4 text-red-500">
        <p>Error: {fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );

  return (
    <>
      <AdminNav />
      <div className="font-inter bg-white">
        <div className="container mx-auto px-4 py-10 md:py-14 lg:py-[56px] max-w-7xl">
          {/* Header Section */}
          <div className="w-full max-w-7xl mx-auto mb-10 md:mb-[40px]">
            <div className="px-4 md:px-8">
              <h1 className="text-2xl md:text-3xl font-bold text-ebony mb-1 md:mb-[4px]">
                Edit Application Cycle
              </h1>
              <p className="text-sm text-paleSky">
                Update the cycle details below
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-form p-6 w-full max-w-7xl mx-auto"
          >
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                Cycle updated successfully!
              </div>
            )}

            {fetchError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {fetchError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Cycle Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-oxfordBlue"
                >
                  Cycle Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Cycle name is required",
                    minLength: {
                      value: 3,
                      message: "Cycle name must be at least 3 characters",
                    },
                  })}
                  className={`w-full p-2 border ${
                    errors.name ? "border-red-500" : "border-mischka"
                  } rounded-md shadow-input text-sm`}
                  placeholder="Enter cycle name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Spacer - keeps layout balanced */}
              <div className="hidden lg:block"></div>

              {/* Start Date Field */}
              <div className="space-y-1">
                <label
                  htmlFor="start_date"
                  className="text-sm font-medium text-oxfordBlue"
                >
                  Start Date *
                </label>
                <input
                  id="start_date"
                  type="date"
                  {...register("start_date", {
                    required: "Start date is required",
                    validate: (value) => {
                      const endDate = watch("end_date");
                      if (endDate && new Date(value) > new Date(endDate)) {
                        return "Start date must be before end date";
                      }
                      return true;
                    },
                  })}
                  className={`w-full p-2 border ${
                    errors.start_date ? "border-red-500" : "border-mischka"
                  } rounded-md shadow-input text-sm`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              {/* End Date Field */}
              <div className="space-y-1">
                <label
                  htmlFor="end_date"
                  className="text-sm font-medium text-oxfordBlue"
                >
                  End Date *
                </label>
                <input
                  id="end_date"
                  type="date"
                  {...register("end_date", {
                    required: "End date is required",
                    validate: (value) => {
                      const startDate = watch("start_date");
                      if (startDate && new Date(value) < new Date(startDate)) {
                        return "End date must be after start date";
                      }
                      return true;
                    },
                  })}
                  className={`w-full p-2 border ${
                    errors.end_date ? "border-red-500" : "border-mischka"
                  } rounded-md shadow-input text-sm`}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-athensGray -mx-6 -mb-6 px-6 py-4 rounded-b-lg flex justify-end gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-mischka rounded-md shadow-input text-sm font-medium text-oxfordBlue bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-input text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer_Variant1 />
    </>
  );
}
