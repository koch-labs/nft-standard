import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateReferenceMetadataArgs {
  metadataAccount: PublicKey
}

export interface UpdateReferenceMetadataAccounts {
  metadataAuthority: PublicKey
  authoritiesGroup: PublicKey
  metadata: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("metadataAccount")])

export function updateReferenceMetadata(
  args: UpdateReferenceMetadataArgs,
  accounts: UpdateReferenceMetadataAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.metadataAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.authoritiesGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([75, 138, 153, 77, 100, 123, 82, 116])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      metadataAccount: args.metadataAccount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
