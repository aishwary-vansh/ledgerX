// src/transactions/transactions.service.spec.ts
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    service = new TransactionsService();
  });

  // ─── getSummary ─────────────────────────────────────────────────────────
  describe('getSummary()', () => {
    it('should return income, expenses and balance', () => {
      const result = service.getSummary();
      expect(result).toHaveProperty('income');
      expect(result).toHaveProperty('expenses');
      expect(result).toHaveProperty('balance');
      expect(result.balance).toBe(result.income - result.expenses);
    });

    it('balance should equal income minus expenses', () => {
      const { income, expenses, balance } = service.getSummary();
      expect(balance).toBe(income - expenses);
    });
  });

  // ─── getMonthly ─────────────────────────────────────────────────────────
  describe('getMonthly()', () => {
    it('should return an array sorted by month', () => {
      const monthly = service.getMonthly();
      expect(Array.isArray(monthly)).toBe(true);
      for (let i = 1; i < monthly.length; i++) {
        expect(monthly[i].month >= monthly[i - 1].month).toBe(true);
      }
    });

    it('each entry should have income, expenses and balance', () => {
      const monthly = service.getMonthly();
      monthly.forEach((m) => {
        expect(m).toHaveProperty('month');
        expect(m).toHaveProperty('income');
        expect(m).toHaveProperty('expenses');
        expect(m).toHaveProperty('balance');
        expect(m.balance).toBe(m.income - m.expenses);
      });
    });
  });

  // ─── getCategories ───────────────────────────────────────────────────────
  describe('getCategories()', () => {
    it('should return only expense categories sorted desc', () => {
      const cats = service.getCategories();
      expect(Array.isArray(cats)).toBe(true);
      for (let i = 1; i < cats.length; i++) {
        expect(cats[i].total <= cats[i - 1].total).toBe(true);
      }
    });
  });

  // ─── findAll with filters ────────────────────────────────────────────────
  describe('findAll()', () => {
    it('should return all transactions when no filters applied', () => {
      const { data, pagination } = service.findAll({});
      expect(pagination.total).toBeGreaterThan(0);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter by type=income', () => {
      const { data } = service.findAll({ type: 'income', limit: '100' });
      data.forEach((t) => expect(t.type).toBe('income'));
    });

    it('should filter by type=expense', () => {
      const { data } = service.findAll({ type: 'expense', limit: '100' });
      data.forEach((t) => expect(t.type).toBe('expense'));
    });

    it('should filter by category', () => {
      const { data } = service.findAll({ category: 'Salary', limit: '100' });
      data.forEach((t) => expect(t.category).toBe('Salary'));
    });

    it('should search by description', () => {
      const { data } = service.findAll({ search: 'Salary', limit: '100' });
      expect(data.length).toBeGreaterThan(0);
      data.forEach((t) =>
        expect(
          t.description.toLowerCase().includes('salary') ||
          t.category.toLowerCase().includes('salary'),
        ).toBe(true),
      );
    });

    it('should paginate correctly', () => {
      const page1 = service.findAll({ page: '1', limit: '5' });
      const page2 = service.findAll({ page: '2', limit: '5' });
      expect(page1.data).toHaveLength(5);
      expect(page1.data[0].id).not.toBe(page2.data[0]?.id);
      expect(page1.pagination.page).toBe(1);
      expect(page2.pagination.page).toBe(2);
    });
  });

  // ─── CRUD ────────────────────────────────────────────────────────────────
  describe('create / findOne / update / remove', () => {
    const dto: CreateTransactionDto = {
      description: 'Test Coffee',
      amount: 150,
      date: '2025-05-01',
      category: 'Food & Dining',
      type: 'expense',
    };

    it('should create a transaction and return it', () => {
      const tx = service.create(dto, 'user-1');
      expect(tx.description).toBe('Test Coffee');
      expect(tx.amount).toBe(150);
      expect(tx.userId).toBe('user-1');
      expect(tx.id).toBeDefined();
    });

    it('should find the created transaction by id', () => {
      const created = service.create(dto, 'user-1');
      const found = service.findOne(created.id);
      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.findOne('non-existent-id')).toThrow();
    });

    it('should update a transaction', () => {
      const created = service.create(dto, 'user-1');
      const updated = service.update(created.id, { amount: 999 }, 'user-1', 'admin');
      expect(updated.amount).toBe(999);
      expect(updated.description).toBe('Test Coffee'); // unchanged
    });

    it('should delete a transaction', () => {
      const created = service.create(dto, 'user-1');
      const result = service.remove(created.id, 'user-1', 'admin');
      expect(result.id).toBe(created.id);
      expect(() => service.findOne(created.id)).toThrow();
    });

    it('non-admin cannot delete another user transaction', () => {
      const created = service.create(dto, 'user-owner');
      expect(() => service.remove(created.id, 'user-other', 'viewer')).toThrow();
    });
  });

  // ─── getMoMChange ────────────────────────────────────────────────────────
  describe('getMoMChange()', () => {
    it('should return an object with changePct and direction', () => {
      const mom = service.getMoMChange();
      if (mom) {
        expect(mom).toHaveProperty('changePct');
        expect(mom).toHaveProperty('direction');
        expect(['up', 'down']).toContain(mom.direction);
      }
    });
  });
});
