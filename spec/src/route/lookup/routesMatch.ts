import { routesMatch } from "src/route/lookup/routesMatch";

describe("routesMatch", () => {
    it("matches routes", () => {
        expect(routesMatch([], [])).toBeTruthy();
    });
});
