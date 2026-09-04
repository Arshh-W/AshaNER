#pragma once

#include <iomanip>
#include <sstream>
#include <string>

class XAIFormatter {
public:
    struct ClinicalSignals {
        float avg_hesitation_pause_sec;
        float pitch_jitter_pct;
        float touch_tremor_variance;
        float facial_valence_mean;
        bool dropped_out_early;
    };

    static void GenerateExplanation(const ClinicalSignals& signals,
                                    std::string& out_primary_factor,
                                    std::string& out_clinical_summary) {
        std::ostringstream summary;
        if (signals.facial_valence_mean < -0.40F) {
            out_primary_factor = "emotional_agitation_sundowning";
            summary << "Patient displayed persistent facial distress markers (AU4). ";
        } else if (signals.avg_hesitation_pause_sec > 2.5F) {
            out_primary_factor = "verbal_hesitation_latency";
            summary << "Pronounced word-finding latency observed ("
                    << std::fixed << std::setprecision(1)
                    << signals.avg_hesitation_pause_sec << "s mean pause). ";
        } else if (signals.touch_tremor_variance > 12.0F) {
            out_primary_factor = "motor_tremor_instability";
            summary << "Significant hand tremor detected during canvas tracing. ";
        } else {
            out_primary_factor = "cognitive_load_fatigue";
            summary << "Normal progression with mild late-session error elevation. ";
        }

        if (signals.dropped_out_early) {
            summary << "Session ended early: therapeutic reminiscence mode engaged to prevent frustration.";
        } else {
            summary << "Completed session within target flow bounds.";
        }
        out_clinical_summary = summary.str();
    }
};