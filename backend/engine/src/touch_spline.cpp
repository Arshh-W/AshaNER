#include "touch_spline.hpp"

#include <algorithm>

TremorCompensatingSpline::TremorCompensatingSpline(float jitter_radius_px,
                                                   float smoothing_factor)
    : jitter_radius_sq(jitter_radius_px * jitter_radius_px),
      alpha_blend(std::clamp(smoothing_factor, 0.0F, 1.0F)) {}

Point2D TremorCompensatingSpline::ApplyExponentialDamping(const Point2D& new_point) {
    if (control_points.empty()) {
        return new_point;
    }

    const Point2D& last = control_points.back();
    const float dx = new_point.x - last.x;
    const float dy = new_point.y - last.y;
    if (dx * dx + dy * dy < jitter_radius_sq) {
        return last;
    }

    return {
        last.x + alpha_blend * dx,
        last.y + alpha_blend * dy,
        new_point.timestamp_ms,
    };
}

void TremorCompensatingSpline::AddRawTouch(float x, float y, float timestamp_ms) {
    const Point2D filtered = ApplyExponentialDamping({x, y, timestamp_ms});
    if (control_points.empty() || filtered.x != control_points.back().x ||
        filtered.y != control_points.back().y) {
        control_points.push_back(filtered);
    }
}

Point2D TremorCompensatingSpline::InterpolateCatmullRom(
    const Point2D& p0, const Point2D& p1, const Point2D& p2, const Point2D& p3,
    float t) {
    const float t2 = t * t;
    const float t3 = t2 * t;

    return {
        0.5F * ((2.0F * p1.x) + (-p0.x + p2.x) * t +
                 (2.0F * p0.x - 5.0F * p1.x + 4.0F * p2.x - p3.x) * t2 +
                 (-p0.x + 3.0F * p1.x - 3.0F * p2.x + p3.x) * t3),
        0.5F * ((2.0F * p1.y) + (-p0.y + p2.y) * t +
                 (2.0F * p0.y - 5.0F * p1.y + 4.0F * p2.y - p3.y) * t2 +
                 (-p0.y + 3.0F * p1.y - 3.0F * p2.y + p3.y) * t3),
        p1.timestamp_ms + t * (p2.timestamp_ms - p1.timestamp_ms),
    };
}

std::vector<Point2D> TremorCompensatingSpline::GenerateSmoothedStroke(
    int interpolation_steps) {
    if (control_points.size() < 4 || interpolation_steps <= 0) {
        return {control_points.begin(), control_points.end()};
    }

    std::vector<Point2D> smoothed_path;
    for (size_t i = 0; i < control_points.size() - 3; ++i) {
        const Point2D& p0 = control_points[i];
        const Point2D& p1 = control_points[i + 1];
        const Point2D& p2 = control_points[i + 2];
        const Point2D& p3 = control_points[i + 3];
        for (int step = 0; step < interpolation_steps; ++step) {
            const float t = static_cast<float>(step) /
                            static_cast<float>(interpolation_steps);
            smoothed_path.push_back(InterpolateCatmullRom(p0, p1, p2, p3, t));
        }
    }
    smoothed_path.push_back(control_points[control_points.size() - 2]);
    return smoothed_path;
}

void TremorCompensatingSpline::ResetStroke() {
    control_points.clear();
}