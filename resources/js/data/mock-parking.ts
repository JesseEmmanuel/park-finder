export type ParkingStatus = 'recent' | 'historical';

export interface MockParkingLot {
    id: number;
    name: string;
    address: string;
    distance: number;
    price: string;
    status: ParkingStatus;
}

export const mockParkingLots: MockParkingLot[] = [
    {
        id: 1,
        name: 'ParkFinder Central Parking',
        address: '123 Main Street',
        distance: 180,
        price: '₱50/hour',
        status: 'recent',
    },
    {
        id: 2,
        name: 'City Mall Parking',
        address: 'City Mall Complex',
        distance: 340,
        price: '₱40/hour',
        status: 'recent',
    },
    {
        id: 3,
        name: 'Public Street Parking',
        address: '8th Avenue',
        distance: 620,
        price: 'Free',
        status: 'historical',
    },
    {
        id: 4,
        name: 'Downtown Parking Building',
        address: 'Downtown District',
        distance: 950,
        price: '₱60/hour',
        status: 'recent',
    },
    {
        id: 5,
        name: 'Community Parking Area',
        address: 'Community Road',
        distance: 1500,
        price: '₱30/hour',
        status: 'historical',
    },
    {
        id: 6,
        name: 'Northside Open Parking',
        address: 'Northside Avenue',
        distance: 1850,
        price: '₱25/hour',
        status: 'recent',
    },
];
