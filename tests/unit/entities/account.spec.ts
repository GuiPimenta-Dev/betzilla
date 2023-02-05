import { Account } from "../../../src/domain/account";

test("It should be able to debit from an account", async () => {
  const account = new Account({ balance: 1000 });
  account.debit(100);
  expect(account.getBalance()).toBe(900);
});

test("It should not be able to debit from an account if the balance is insufficient", async () => {
  const account = new Account({ balance: 100 });
  expect(() => account.debit(1000)).toThrowError("Insufficient funds");
});

test("It should be able to credit to an account", async () => {
  const account = new Account({ balance: 1000 });
  account.credit(100);
  expect(account.getBalance()).toBe(1100);
});
