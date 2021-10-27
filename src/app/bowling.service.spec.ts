import { ICurrentFrame, IFrame } from "./bowling.interface";
import { BowlingService } from "./bowling.service";

describe("BowlingService", () => {
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
      const frame: ICurrentFrame = { index: 0, rollIndex: 0, amount: 10 };

      expect(service.isFirstRollStrike(frame)).toBe(true);
    });
    it("returns false if not second roll", () => {
      const frame: ICurrentFrame = { index: 0, rollIndex: 1, amount: 10 };

      expect(service.isFirstRollStrike(frame)).toBe(false);
    });
    it("returns false if first roll but frame amount less 10", () => {
      const frame: ICurrentFrame = { index: 0, rollIndex: 0, amount: 6 };

      expect(service.isFirstRollStrike(frame)).toBe(false);
    });
  });

  describe("#isPrevFrameSpare", () => {
    const frame: ICurrentFrame = { index: 1, rollIndex: 0, amount: 2 };

    it("returns true if prev frame has spare", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [4, 6], gameCount: 10 }],
      ]);

      expect(service.isPrevFrameSpare(framesGame, frame)).toBe(true);
    });

    it("returns false if prev frame has no spare", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [2, 6], gameCount: 8 }],
      ]);

      expect(service.isPrevFrameSpare(framesGame, frame)).toBe(false);
    });
  });

  describe("#isPrevFrameStrike", () => {
    const frame: ICurrentFrame = { index: 1, rollIndex: 0, amount: 2 };

    it("returns true if prev frame has strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [10], gameCount: 10 }],
      ]);

      expect(service.isPrevFrameStrike(framesGame, frame)).toBe(true);
    });

    it("returns false if prev frame has no strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [2, 2], gameCount: 4 }],
      ]);

      expect(service.isPrevFrameStrike(framesGame, frame)).toBe(false);
    });
  });

  describe("#isPrevPrevFrameStrike", () => {
    const frame: ICurrentFrame = { index: 2, rollIndex: 0, amount: 2 };

    it("returns true if prev prev frame has strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [10], gameCount: 10 }],
        [1, { rolledPins: [1, 1], gameCount: 14 }],
      ]);

      expect(service.isPrevPrevFrameStrike(framesGame, frame)).toBe(true);
    });

    it("returns false if prev prev frame has no strike", () => {
      const framesGame = new Map<number, IFrame>([
        [0, { rolledPins: [1, 1], gameCount: 2 }],
        [1, { rolledPins: [10], gameCount: 12 }],
      ]);

      expect(service.isPrevPrevFrameStrike(framesGame, frame)).toBe(false);
    });
  });

  describe("#isLastRollInFrameReached", () => {
    it("returns true if first roll is strike", () => {
      const frame: ICurrentFrame = { index: 0, rollIndex: 0, amount: 10 };

      expect(service.isLastRollInFrameReached(frame)).toBe(true);
    });

    it("returns true if second roll done", () => {
      const frame: ICurrentFrame = { index: 1, rollIndex: 1, amount: 8 };

      expect(service.isLastRollInFrameReached(frame)).toBe(true);
    });

    it("returns false if first roll done", () => {
      const frame: ICurrentFrame = { index: 1, rollIndex: 0, amount: 8 };

      expect(service.isLastRollInFrameReached(frame)).toBe(false);
    });
  });

  describe("#isLastRollInLastFrameReached", () => {
    it("returns true if last frame and first + second roll less 10", () => {
      const frame: ICurrentFrame = { index: 9, rollIndex: 1, amount: 8 };

      expect(service.isLastRollInLastFrameReached(frame)).toBe(true);
    });

    it("returns true if last frame and third roll done", () => {
      const frame: ICurrentFrame = { index: 9, rollIndex: 2, amount: 18 };

      expect(service.isLastRollInLastFrameReached(frame)).toBe(true);
    });

    it("returns false if not in last frame", () => {
      const frame: ICurrentFrame = { index: 7, rollIndex: 1, amount: 8 };

      expect(service.isLastRollInLastFrameReached(frame)).toBe(false);
    });
  });
});
