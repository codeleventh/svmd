import React from "react";
import {useParams} from "react-router-dom";

interface IParams {
    mapId: string;
}

export const MapPage: React.FC = () => {
    const {mapId} = useParams<IParams>();

    return <h1>Map with id={mapId}</h1>
};

export default MapPage;
