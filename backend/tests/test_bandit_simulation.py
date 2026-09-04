import math


BANDIT_DIM = 4
NUM_ACTIONS = 4


class PurePyLinUCB:
    def __init__(self, alpha=1.0):
        self.alpha = alpha
        self.A = [
            [[1.0 if i == j else 0.0 for j in range(BANDIT_DIM)]
             for i in range(BANDIT_DIM)]
            for _ in range(NUM_ACTIONS)
        ]
        self.b = [[0.0 for _ in range(BANDIT_DIM)] for _ in range(NUM_ACTIONS)]

    def invert_4x4(self, matrix):
        augmented = [
            row[:] + [1.0 if i == j else 0.0 for j in range(BANDIT_DIM)]
            for i, row in enumerate(matrix)
        ]
        for i in range(BANDIT_DIM):
            pivot = max(range(i, BANDIT_DIM), key=lambda row: abs(augmented[row][i]))
            augmented[i], augmented[pivot] = augmented[pivot], augmented[i]
            pivot_value = augmented[i][i]
            if abs(pivot_value) < 1e-6:
                return None
            for j in range(2 * BANDIT_DIM):
                augmented[i][j] /= pivot_value
            for row in range(BANDIT_DIM):
                if row != i:
                    factor = augmented[row][i]
                    for j in range(2 * BANDIT_DIM):
                        augmented[row][j] -= factor * augmented[i][j]
        return [row[BANDIT_DIM:] for row in augmented]

    def select_action(self, context):
        best_ucb = -1e9
        best_action = 1
        for action in range(NUM_ACTIONS):
            inverse = self.invert_4x4(self.A[action])
            if inverse is None:
                continue
            theta = [
                sum(inverse[i][j] * self.b[action][j] for j in range(BANDIT_DIM))
                for i in range(BANDIT_DIM)
            ]
            mean = sum(theta[i] * context[i] for i in range(BANDIT_DIM))
            variance = sum(
                sum(context[j] * inverse[j][i] for j in range(BANDIT_DIM)) * context[i]
                for i in range(BANDIT_DIM)
            )
            ucb = mean + self.alpha * math.sqrt(max(0.0, variance))
            if ucb > best_ucb:
                best_ucb = ucb
                best_action = action
        return best_action

    def update(self, action, context, reward):
        for i in range(BANDIT_DIM):
            for j in range(BANDIT_DIM):
                self.A[action][i][j] += context[i] * context[j]
            self.b[action][i] += reward * context[i]


bandit = PurePyLinUCB(alpha=0.5)
stressed_context = [0.8, 0.7, 1.8, -0.6]

for _ in range(25):
    bandit.update(action=0, context=stressed_context, reward=2.0)
    bandit.update(action=2, context=stressed_context, reward=-2.0)

decision = bandit.select_action(stressed_context)
assert decision == 0, f"Expected action 0 (DECREASE_DIFFICULTY), got {decision}"

print("LinUCB Pure Simulation: PASSED (Correctly learned to mitigate cognitive strain)")