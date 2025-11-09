"use client";

import { authClient } from "@/auth-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import ImpersonateUser from "./impersonate-user";
import { useIsMobile } from "@/hooks/useIsMobile";

type AuthUser = {
  id: string;
  name?: string;
  email: string;
  role: string;
  emailVerified: boolean;
  premium?: boolean;
  banned?: boolean;
  createdAt: string | Date;
};

export default function UsersTable() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await authClient.admin.listUsers({
          query: { limit: 10 },
        });

        if (response?.data) {
          setUsers(response.data.users as AuthUser[]);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Failed to fetch users")
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <span className="text-red-500">Error: {error.message}</span>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {!isMobile && <TableHead>Email</TableHead>}
          <TableHead>Role</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Premium</TableHead>
          {!isMobile && <TableHead>Status</TableHead>}
          {!isMobile && <TableHead>Joined</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            {!isMobile && <TableCell>{user.email}</TableCell>}
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
            <TableCell>
              {user.banned ? (
                <span className="text-red-500">Banned</span>
              ) : (
                <span className="text-green-500">Active</span>
              )}
            </TableCell>
            {!isMobile && (
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            )}
            {!isMobile && (
              <TableCell>
                <ImpersonateUser userId={user.id} />{" "}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
