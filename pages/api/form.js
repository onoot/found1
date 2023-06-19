import {sequelize} from "./database/sequelize";
import {Coordinate} from "./database/user";


export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { lat, long, isLostPet, buttonType } = req.body;

                const coordinate = new Coordinate({
                    lat,
                    long,
                    isLostPet,
                    buttonType,
                });

                const savedCoordinate = await coordinate.save();

                res.status(201).json(savedCoordinate);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
            }
            break;
        default:
            res.status(405).json({ message: "Method not allowed" });
            break;
    }
}
