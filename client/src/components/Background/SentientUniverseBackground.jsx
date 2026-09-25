/**
 * SentientUniverseBackground — Master Living Digital Environment
 *
 * Coordinates the clean Sentient Engineering Universe:
 * - Layer 1: Deep Space Atmosphere (Cosmic cyan/indigo plasma fields)
 * - Layer 2: Neural Particle Network (60FPS organic neural graph)
 * - Layer 4: Data Flow Streams (Vertical digital buslines)
 * - Layer 5: Cursor Intelligence Interaction (Electromagnetic aura & deflection)
 *
 * Zero intrusive text components — pure, living digital atmosphere.
 */

import { memo } from "react";
import { DeepSpaceAtmosphere } from "./DeepSpaceAtmosphere";
import { NeuralUniverseCanvas } from "./NeuralUniverseCanvas";

export const SentientUniverseBackground = memo(
  function SentientUniverseBackground() {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
        data-testid="sentient-universe-background"
      >
        {/* Layer 1: Cosmic Atmosphere & Dynamic Energy Meshes */}
        <DeepSpaceAtmosphere />

        {/* Layer 2, 4, 5: Neural Canvas, Data Streams & Cursor Magnetic Intelligence */}
        <NeuralUniverseCanvas />
      </div>
    );
  }
);

export default SentientUniverseBackground;
