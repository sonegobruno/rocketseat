import { Game } from "../entities/game/game";
import { GameDTO } from "../entities/game/game.dto";
import { SelectItems } from "../entities/selectItems";

export function gameMapper(games: GameDTO[]): Game[] {
    return games.map(game => ({
        id: game.id,
        title: game.title,
        bannerUrl: game.bannerUrl,
        adsCount: game._count.ads,
    }))
}

export function formatGameToSelectItems(games: Game[]): SelectItems[] {
    return games.map(game => ({
        value: game.id,
        label: game.title
    }))
}