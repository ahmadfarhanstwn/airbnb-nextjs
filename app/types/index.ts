import { Listing, Reservation, User } from "@prisma/client";

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

export type SafeReservation = Omit<
    Reservation,
    'createdAt' | 'startDate' | 'endDate' | 'listing'
> & {
    createdAt: string,
    startDate: string,
    endDate: string,
    listing: SafeListing
}