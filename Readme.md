# Hotel Management System API

A robust backend API for a Hotel Management System built with "Node.js", "Express", and "MongoDB".

## Features

* User Management: (Implied by `userRoutes`)
* Guest Management: CRUD operations for guest information. (Implied by `guestRoutes`)
* Room Management: Management of room details and availability. (Implied by `roomRoutes`)
* Booking Management: Handling of room bookings. (Implied by `bookingRoutes`)
* Database: MongoDB Atlas powered by Mongoose ORM.
* Environment Variables: Uses `dotenv` for configuration.

<h2>Base URL</h2>
https://crud-theta-three.vercel.app

## End Points

## Guest End Points
* GET    /api/guests              - Get all guests
* GET    /api/guests/:id          - Get specific guest
* POST   /api/guests              - Create new guest
* PUT    /api/guests/:id          - Update guest info
* DELETE /api/guests/:id          - Delete guest
## Room End Points
* GET    /api/rooms               - Get all rooms
* GET    /api/rooms/:id           - Get specific room
* GET    /api/rooms/available     - Get available rooms
* POST   /api/rooms               - Add new room
* PUT    /api/rooms/:id           - Update room details
* DELETE /api/rooms/:id           - Delete room

## Booking End Points
* GET    /api/bookings            - Get all bookings
* GET    /api/bookings/:id        - Get specific booking
* POST   /api/bookings            - Create new booking
* PUT    /api/bookings/:id        - Update booking
* DELETE /api/bookings/:id        - Cancel booking
* GET    /api/bookings/guest/:guestId - Get bookings by guest

<h2>Testing with postman</h2>
<h2>Create guests</h2>
GET http://localhost:3000/api/guests
<pre>
{
    "name": "Claude",
    "email": "claude@gmail.com",
    "phone": "099-272-543"
}
</pre>

<h2>Create a booking and Check if the room is available</h2>
GET http://localhost:3000/api/bookings
<pre>
{
  "guestId": "68ef3228a7fb785c03cb2ac3",
  "roomId": "68ef3239a7fb785c03cb2ac7",
  "checkIn": "2025-10-15",
  "checkOut": "2025-10-16",
  "status": "confirmed"
}
</pre>

<h2>Create room and check it's status</h2>
GET http://localhost:3000/api/bookings
<pre>
{
  "number": "109",
  "type": "single",
  "price": 100,
  "status": "available"
}
</pre>

<h2>Checking how many rooms is available</h2>
GET http://localhost:3000/api/rooms
<pre>
[
    {
        "_id": "68ef2bd2a7fb785c03cb2abf",
        "number": "101",
        "type": "single",
        "price": 100,
        "status": "occupied",
        "createdAt": "2025-10-15T05:06:26.438Z",
        "updatedAt": "2025-10-15T08:22:46.793Z",
        "__v": 0
    },
    {
        "_id": "68ef3239a7fb785c03cb2ac7",
        "number": "105",
        "type": "single",
        "price": 100,
        "status": "occupied",
        "createdAt": "2025-10-15T05:33:45.091Z",
        "updatedAt": "2025-10-16T12:15:19.900Z",
        "__v": 0
    },
    {
        "_id": "68f0e319cf367c9dfbe35a4c",
        "number": "109",
        "type": "single",
        "price": 100,
        "status": "available",
        "createdAt": "2025-10-16T12:20:41.021Z",
        "updatedAt": "2025-10-16T12:20:41.021Z",
        "__v": 0
    }
]
</pre>

<h2>Deleting a guest from a list</h2>
GET http://localhost:3000/api/guests/:id
<pre>
{
    "message": "Guest deleted successfully"
}
</pre>






