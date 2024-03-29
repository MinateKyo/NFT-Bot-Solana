import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import logger from "lib/logger";

export default interface NFTData {
  name: string;
  symbol: string;
  image: string;
  sellerFeeBasisPoints: number;
}

export async function fetchNFTData(
  web3Conn: Connection,
  token: string
): Promise<NFTData | undefined> {
  const metaplex = new Metaplex(web3Conn);

  try {
    const metadata = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(token),
      loadJsonMetadata: true,
    });
    if (!metadata.json) {
      return;
    }

    return {
      name: metadata.json.name || "",
      symbol: metadata.json.symbol || "",
      image: metadata.json.image || "",
      sellerFeeBasisPoints: metadata.json.seller_fee_basis_points || 0,
    };
  } catch (e) {
    logger.error("fetch NFT data failed", e);
  }
}
