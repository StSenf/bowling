import { IFrame } from "./bowling.interface";
import { BowlingService } from "./bowling.service";

fdescribe("BowlingService", () => {
  let service: BowlingService;

  beforeEach(() => {
    service = new BowlingService();
  });

  describe("#isRegularFrame", () => {
    it("returns true if frame index between 0 and 9", () => {
      expect(service.isRegularFrame(1)).toBe(true);
      expect(service.isRegularFrame(8)).toBe(true);
    });

    it("returns false if frame index 0 or greater 8", () => {
      expect(service.isRegularFrame(0)).toBe(false);
      expect(service.isRegularFrame(9)).toBe(false);
    });
  });

  describe("#isLastFrame", () => {
    it("returns true if frame index is 9", () => {
      expect(service.isLastFrame(9)).toBe(true);
    });

    it("returns false if frame index is unequal 9", () => {
      expect(service.isLastFrame(2)).toBe(false);
    });
  });

  describe("#isFirstFrame", () => {
    it("returns true if frame index is 0", () => {
      expect(service.isFirstFrame(0)).toBe(true);
    });

    it("returns false if frame index is unequal 0", () => {
      expect(service.isFirstFrame(2)).toBe(false);
    });
  });

  describe("#isSecondRoll", () => {
    it("returns true if roll index is 1", () => {
      expect(service.isSecondRoll(1)).toBe(true);
    });

    it("returns false if roll index is unequal 1", () => {
      expect(service.isSecondRoll(2)).toBe(false);
    });
  });

  describe("#isThirdRoll", () => {
    it("returns true if roll index is 2", () => {
      expect(service.isThirdRoll(2)).toBe(true);
    });

    it("returns false if roll index is unequal 2", () => {
      expect(service.isThirdRoll(1)).toBe(false);
    });
  });

  describe("#isFirstRollStrike", () => {
    it("returns true if second roll and frame amount is 10", () => {
      expect(service.isFirstRollStrike(1, 10)).toBe(true);
    });
    it("returns false if not second roll", () => {
      expect(service.isFirstRollStrike(2, 10)).toBe(false);
    });
    it("returns false if second roll but frame amount less 10", () => {
      expect(service.isFirstRollStrike(1, 6)).toBe(false);
    });
  });

  describe("#isPrevFrameSpare", () => {
    it("returns true if prev frame has spare", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [4, 6], gameCount: 10 }],
      ]);

      expect(service.isPrevFrameSpare(framesGame, 1)).toBe(true);
    });

    it("returns false if prev frame has no spare", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [2, 6], gameCount: 8 }],
      ]);

      expect(service.isPrevFrameSpare(framesGame, 1)).toBe(false);
    });
  });

  describe("#isPrevFrameStrike", () => {
    it("returns true if prev frame has strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [10], gameCount: 10 }],
      ]);

      expect(service.isPrevFrameStrike(framesGame, 1)).toBe(true);
    });

    it("returns false if prev frame has no strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [2, 2], gameCount: 4 }],
      ]);

      expect(service.isPrevFrameStrike(framesGame, 1)).toBe(false);
    });
  });

  describe("#isPrevPrevFrameStrike", () => {
    it("returns true if prev prev frame has strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [10], gameCount: 10 }],
        [1, { rolledPins: [1, 1], gameCount: 14 }],
      ]);

      expect(service.isPrevPrevFrameStrike(framesGame, 2)).toBe(true);
    });

    it("returns false if prev prev frame has no strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [1, 1], gameCount: 2 }],
        [1, { rolledPins: [10], gameCount: 12 }],
      ]);

      expect(service.isPrevPrevFrameStrike(framesGame, 2)).toBe(false);
    });
  });
});
