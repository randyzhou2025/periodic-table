#!/usr/bin/env node
import "dotenv/config";
import { db } from "./db/index.js";
import { licenseCodes } from "./db/schema.js";
import { generateLicenseCode } from "./lib/code.js";
import { loadConfig } from "./lib/config.js";
import { codePrefixFromNormalized, hashLicenseCode } from "./lib/hash.js";

async function createCode(args: string[]) {
  const config = loadConfig();
  let buyerNote: string | undefined;
  let maxDevices = config.maxDevicesDefault;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--note" && args[i + 1]) {
      buyerNote = args[i + 1];
      i += 1;
    } else if (args[i] === "--devices" && args[i + 1]) {
      maxDevices = Number(args[i + 1]);
      i += 1;
    }
  }

  const { normalized, formatted } = generateLicenseCode();
  const codeHash = hashLicenseCode(normalized, config.sessionSecret);

  await db.insert(licenseCodes).values({
    codeHash,
    codePrefix: codePrefixFromNormalized(normalized),
    maxDevices,
    buyerNote,
  });

  console.log("授权码（仅显示一次，请立即保存）：");
  console.log(formatted);
  if (buyerNote) {
    console.log(`备注：${buyerNote}`);
  }
}

const [command, ...rest] = process.argv.slice(2);
if (command === "create-code") {
  createCode(rest)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  console.error("用法: npm run admin:create-code -- [--note 备注] [--devices 1]");
  process.exit(1);
}
