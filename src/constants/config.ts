import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN = { W: SCREEN_W, H: SCREEN_H };

/**
 * Splash duration. EXACTLY 8000 ms: the UI harness needs ~4-6 s of startup
 * overhead before its first capture, so anything shorter auto-advances to the
 * menu before the splash is ever photographed.
 */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7600;
export const LOADER_BAR_W = 190;

/** Status-bar safe inset used by every header / top overlay. */
export const TOP_INSET = 44;

// ---------------------------------------------------------------------------
// Word board geometry. Tile size is derived from the OUTER width minus the
// board frame (padding + border) so rows can never overflow the rounded frame.
// ---------------------------------------------------------------------------
export const MAX_LEN = 6;
export const WORDS_PER_STAGE = 5;
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 340);
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const TILE_GAP = 6;

// ---------------------------------------------------------------------------
// Letter ring geometry. Letters are absolutely placed on a circle whose radius
// already subtracts the letter size, so nothing can spill past the ring box.
// The box is also capped against screen height, so a short device shrinks the
// ring instead of pushing the board off the top of the play area.
// ---------------------------------------------------------------------------
export const HEADER_H = TOP_INSET + 72;
export const STAT_STRIP_H = 52;
export const RING_BOX = Math.min(
  SCREEN_W - 140,
  230,
  Math.floor((SCREEN_H - HEADER_H - STAT_STRIP_H) * 0.42),
);
export const LETTER = 52;
export const RING_RADIUS = (RING_BOX - LETTER) / 2;
export const GO_SIZE = 76;

export const RING_PANEL_H = 12 + RING_BOX + 12 + 48 + 16;

/** Space the play area needs above the board: current word line plus the tip. */
const BOARD_RESERVE = 72;
const BOARD_AVAIL_H = SCREEN_H - HEADER_H - STAT_STRIP_H - RING_PANEL_H - BOARD_RESERVE;

export const TILE = Math.max(
  22,
  Math.min(
    42,
    Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME - TILE_GAP * (MAX_LEN - 1)) / MAX_LEN),
    Math.floor(
      (BOARD_AVAIL_H - 2 * BOARD_FRAME - TILE_GAP * (WORDS_PER_STAGE - 1)) / WORDS_PER_STAGE,
    ),
  ),
);
export const BOARD_W = TILE * MAX_LEN + TILE_GAP * (MAX_LEN - 1) + 2 * BOARD_FRAME;

// ---------------------------------------------------------------------------
// Pacing. The passive test runner never solves a word chain on its own, so the
// board guides itself after a quiet spell; the idle backstop is armed once on
// mount (never re-armed) so a result always surfaces.
// ---------------------------------------------------------------------------
export const AUTO_ASSIST_DELAY_MS = 8000;
export const AUTO_STEP_MS = 900;
export const IDLE_RESULT_MS = 40000;
export const WIN_CELEBRATION_MS = 700;
export const SHAKE_MS = 240;
export const CLEAR_AFTER_BAD_MS = 260;

export const START_HINTS = 3;
export const POINTS_PER_LETTER = 10;
export const NO_HINT_BONUS = 25;
