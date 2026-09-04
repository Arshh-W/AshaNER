#pragma once

#include <cmath>
#include <deque>
#include <vector>

struct Point2D {
    float x;
    float y;
    float timestamp_ms;
};

class TremorCompensatingSpline {
public:
    TremorCompensatingSpline(float jitter_radius_px = 6.0F,
                             float smoothing_factor = 0.25F);

    void AddRawTouch(float x, float y, float timestamp_ms);
    std::vector<Point2D> GenerateSmoothedStroke(int interpolation_steps = 8);
    void ResetStroke();

private:
    float jitter_radius_sq;
    float alpha_blend;
    std::deque<Point2D> control_points;

    Point2D ApplyExponentialDamping(const Point2D& new_point);
    Point2D InterpolateCatmullRom(const Point2D& p0, const Point2D& p1,
                                  const Point2D& p2, const Point2D& p3,
                                  float t);
};