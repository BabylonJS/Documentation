import { SearchResults } from "../search";
import { getBabylonLiteMenuItems } from "../../lib/babylonLiteDocs";

export default function BabylonLiteSearchResults({ flavorMenuItems }: { flavorMenuItems?: Awaited<ReturnType<typeof getBabylonLiteMenuItems>> }) {
    return <SearchResults flavorId="lite" flavorMenuItems={flavorMenuItems} />;
}

export const getStaticProps = async () => {
    const flavorMenuItems = await getBabylonLiteMenuItems();
    return {
        props: {
            ...(flavorMenuItems ? { flavorMenuItems } : {}),
        },
    };
};