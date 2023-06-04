import { Listing, User } from "@prisma/client";

export type SafeUser = Omit<
    User,
    'emailVerified' | 'createdAt' | 'updatedAt'
> & {
    emailVerified: string | null;
    createdAt: string;
    updatedAt: string;
}

export type SafeListing = Omit<
    Listing,
    'createdAt'
> & {
    createdAt: string
}