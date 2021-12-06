import sys
import copy


def check_line(line):
    for cell in line:
        if cell != 'x':
            break
    else:
        return True
    return False


def check_board_lines(board):
    for line in board:
        if (check_line(line)):
            return True


def check_board_column(board):
    for column_idx in range(5):
        line = [board[idx][column_idx] for idx in range(5)]
        if check_line(line):
            return True


def check_board_diagonals(board):
    top_left_diagonal = [board[idx][idx] for idx in range(5)]
    bottom_left_diagonal = [board[idx][4-idx] for idx in range(5)]
    return check_line(top_left_diagonal) or check_line(bottom_left_diagonal)


def check_board(board):
    # or check_board_diagonals(board)
    return check_board_lines(board) or check_board_column(board)


def score_board(board, winning_call):
    sums = [sum([cell if type(cell) == int else 0 for cell in line])
            for line in board]
    return sum(sums) * winning_call


call_outs = [int(x) for x in sys.stdin.readline().split(",")]
sys.stdin.readline()
boards = []

# Boards are represented as 5x5 matrix
current_board = []


for line in sys.stdin.readlines():
    if (line.strip() == ''):
        boards.append(current_board)
        current_board = []
    else:
        current_board.append([int(x) for x in line.split()])
boards.append(current_board)

winning_board = None
winning_score = None

# Part 1

p1Boards = copy.deepcopy(boards)

for call_idx, call_out in enumerate(call_outs):
    for board_idx, board in enumerate(p1Boards):
        for line_idx, line in enumerate(board):
            for cell_idx, cell in enumerate(line):
                if cell == call_out:
                    board[line_idx][cell_idx] = 'x'
                    if check_board(board):
                        winning_board = board
                        winning_score = score_board(board, call_out)
                        break
            if winning_board:
                break
        if winning_board:
            break
    if winning_board:
        break


print(f"Part 1: {winning_score}")

winning_boards = set()


def print_board(board):
    for line in board:
        # print(" ".join([str(cell).zfill(2) for cell in line]))
        pass


for call_idx, call_out in enumerate(call_outs):
    # print("CALL", call_out, len(winning_boards))
    if (len(winning_boards) - len(boards) == 0):
        break
    for board_idx, board in enumerate(boards):
        if board_idx in winning_boards:
            # print("board already complete", board_idx)
            continue
        print_board(board)
        winner = False
        for line_idx, line in enumerate(board):
            for cell_idx, cell in enumerate(line):
                if cell == call_out:
                    # print(f"Marking out {call_out} on board {board_idx} at {line_idx}, {cell_idx}")
                    if call_out == 16:
                        print_board(board)
                    board[line_idx][cell_idx] = 'x'
                    if call_out == 16:
                        print_board(board)
                    if check_board(board):
                        winning_boards.add(board_idx)
                        if (len(winning_boards) - len(boards) == 0):
                            # print(call_out)
                            print_board(board)
                            winning_score = score_board(board, call_out)
                        winner = True
                        break
            if (winner):
                break


print(f"Part 2: {winning_score}")
