import { SearchResults } from "../search";

export default function BabylonLiteSearchResults() {
    return <SearchResults flavorId="lite" />;
}

export { getStaticProps } from "../search";