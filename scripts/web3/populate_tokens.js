import { PrismaClient } from "@prisma/client";
import { TOKEN_LIST_URL } from "../constants/API.js";
import { ETH_ADDRESS } from "../constants/ABI.js";

const ethereumToken = {
  address: ETH_ADDRESS,
  chainId: 1,
  decimals: 18,
  extensions: undefined,
  logoURI: "",
  name: "Ethereum",
  symbol: "ETH",
};

const prisma = new PrismaClient();

async function populateTokens() {
  try {
    const startTime = new Date();
    console.log(
      `Starting population at ${startTime.getMonth()}-${startTime.getDate()}
       ${startTime.getHours()}: ${startTime.getMinutes()}: ${startTime.getSeconds()}...`
    );

    const tokens = await fetch(TOKEN_LIST_URL)
      .then((result) => result.json())
      .then((data) => {
        const tokensData = data.tokens.filter((token) => {
          return token.chainId === 1;
        });
        tokensData.push(ethereumToken);
        return tokensData;
      });

    await prisma.token.deleteMany({});

    tokens.forEach(async (token) => {
      await prisma.token.create({
        data: {
          address:
            token.address !== ETH_ADDRESS
              ? token.address.toLowerCase()
              : token.address,
          chainId: token.chainId,
          decimals: token.decimals,
          logoURI: token.logoURI,
          name: token.name,
          symbol: token.symbol,
        },
      });
    });
    try {
      await prisma.token.delete({
        where: { address: "0x0000000000000000000000000000000000000000" },
      });
    } catch (e) {
      console.log(
        "\nThere was no need for this deletion but it's fine, proceeding"
      );
    }

    const endTime = new Date();
    console.log(
      `Ending population at ${endTime.getMonth()}-${endTime.getDate()}
       ${endTime.getHours()}: ${endTime.getMinutes()}: ${endTime.getSeconds()}`
    );
  } catch (e) {
    console.log(e);
  }
}

populateTokens();
setInterval(populateTokens, 43200000); //Every 12 hours.
