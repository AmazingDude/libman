# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++11 -I include

# Directories
SRC_DIR = src
INCLUDE_DIR = include

# Source files
SOURCES = $(wildcard $(SRC_DIR)/*.cpp)

# Output executable
TARGET = library.exe

# Default target
all: $(TARGET)

# Build executable
$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) $(SOURCES) -o $(TARGET)

# Clean build artifacts
clean:
	del /Q $(TARGET) 2>nul || true

# Rebuild from scratch
rebuild: clean all

# Run list_books command
run-books:
	.\$(TARGET) list_books

# Run list_users command
run-users:
	.\$(TARGET) list_users

# Run list_transactions command
run-transactions:
	.\$(TARGET) list_transactions

.PHONY: all clean rebuild run-books run-users run-transactions
