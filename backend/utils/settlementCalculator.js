function calculateSettlement(members, transactions, currency) {
    const net = {}; // 每位成员的净额（正数代表被欠，负数代表欠别人）
    members.forEach((m) => (net[m.name] = 0)); // 初始化每个人的净额为 0
  
    transactions
      .filter((tx) => tx.currency === currency) // 仅处理指定币种的记录
      .forEach((tx) => {
        const split = tx.amount / tx.participants.length; // 每人应分摊的金额
        tx.participants.forEach((p) => (net[p] -= split)); // 平摊人扣除应付金额
        const payerShare = tx.amount / tx.payer.length; // 每位付款人支付的份额
        tx.payer.forEach((p) => (net[p] += payerShare)); // 付款人加上实际支付金额
      });
  
    const creditors = [], debtors = []; // 收钱人（creditors）和欠钱人（debtors）
    for (const [name, balance] of Object.entries(net)) {
      if (balance > 0) creditors.push({ name, balance }); // 被欠钱
      if (balance < 0) debtors.push({ name, balance: -balance }); // 欠别人钱
    }
  
    // 将两组人按金额排序，方便匹配
    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => b.balance - a.balance);
  
    const result = []; // 最终结算结果数组
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.balance, creditor.balance); // 本轮结算金额
      result.push({ from: debtor.name, to: creditor.name, amount, currency }); // 记录一笔转账
      debtor.balance -= amount; // 更新欠款方余额
      creditor.balance -= amount; // 更新收款方余额
      if (debtor.balance === 0) i++; // 欠款清零，进入下一个
      if (creditor.balance === 0) j++; // 收款清零，进入下一个
    }
    return result; // 返回完整的“谁欠谁多少钱”列表
  }
  
  module.exports = { calculateSettlement }; // 导出结算计算函数
  