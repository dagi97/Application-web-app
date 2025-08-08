"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import AdminNav from "@/app/components/navigation/AdminNav";
import Button from "@/app/components/Button";
import SearchBar from "@/app/components/admin/SearchBar";
import UserTable from "@/app/components/admin/UserTable";
import Footer_Variant1 from "@/app/components/footer/footer_variant1";
import Pagination from "@/app/components/admin/Pagination";
import { useGetPaginatedUsersQuery, useGetAllUsersForSearchQuery } from "@/lib/redux/api/adminApi";
import { RootState } from "@/lib/redux/store";
import { setSearchText, setRole, setCurrentPage } from "@/lib/redux/slices/admin/filterSlice";

const Page = () => {
  const dispatch = useDispatch();
  const { searchText, role, currentPage } = useSelector((state: RootState) => state.filter);

  const isSearchActive = searchText.trim().length > 0;
  
  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    isError: paginatedError,
  } = useGetPaginatedUsersQuery(
    { page: currentPage, limit: 5 },
    { skip: isSearchActive }
  );

  const {
    data: allUsersData,
    isLoading: allLoading,
    isError: allError,
  } = useGetAllUsersForSearchQuery(undefined, {
    skip: !isSearchActive,
  });

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [searchText, role, dispatch]);

  const { usersToDisplay, totalPages, totalResults } = useMemo(() => {
    const limit = 5;

    if (isSearchActive) {
      const allSourceUsers = allUsersData?.users ?? [];
      const filteredUsers = allSourceUsers.filter(user => {
        const searchLower = searchText.toLowerCase().trim();
        const searchMatch =
          user.full_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower);
        const roleMatch =
          role && role !== "All Roles"
            ? user.role.toLowerCase() === role.toLowerCase()
            : true;
        return searchMatch && roleMatch;
      });

      const total = filteredUsers.length;
      const pages = Math.ceil(total / limit);
      const startIndex = (currentPage - 1) * limit;
      const paginated = filteredUsers.slice(startIndex, startIndex + limit);
      
      return { usersToDisplay: paginated, totalPages: pages, totalResults: total };
    } else {
      const backendUsers = paginatedData?.users ?? [];
      
      const roleFilteredUsers = backendUsers.filter(user => 
        role && role !== "All Roles"
          ? user.role.toLowerCase() === role.toLowerCase()
          : true
      );

      const total = paginatedData?.total_count ?? 0; 
      const pages = Math.ceil(total / limit);

      
      return { usersToDisplay: roleFilteredUsers, totalPages: pages, totalResults: total };
    }

  }, [isSearchActive, paginatedData, allUsersData, searchText, role, currentPage]);


  const isLoading = paginatedLoading || allLoading;
  const isApiError = paginatedError || allError;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(e.target.value));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setRole(e.target.value));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-8">Loading users...</div>;
    }

    if (isApiError) {
      return (
        <div className="text-center p-8 text-red-500">
          Error fetching data. Please try again later.
        </div>
      );
    }

    if (usersToDisplay.length === 0) {
      return (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">No Users Found</h3>
          <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria.
          </p>
        </div>
      );
    }

    return <UserTable users={usersToDisplay} />;
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen flex flex-col">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* ... Header and SearchBar ... */}
         <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-[#111827] text-3xl font-bold">User Management</h1>
            <p className="text-[#4B5563] font-normal">
              Administer and manage all users on the platform.
            </p>
          </div>
          <div>
            <Link href="/admin/users/create_user">
              <Button size="admin">
                <p className="whitespace-nowrap">Create New User</p>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-7">
          <SearchBar
            searchText={searchText}
            role={role}
            handleSearchChange={handleSearchChange}
            handleRoleChange={handleRoleChange}
          />
        </div>

        <div className="mb-7">{renderContent()}</div>

        {/* This condition will now work correctly! */}
        {totalPages > 1 && !isLoading && (
          <div className="mb-56"> 
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              limit={5}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
      <div className="mt-auto">
        <Footer_Variant1 />
      </div>
    </div>
  );
};

export default Page;