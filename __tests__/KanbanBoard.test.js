/**
 * @fileoverview Unit tests for the KanbanBoard component.
 * These tests verify role-based rendering, socket events, and data loading.
 * Additional simple tests are included to increase coverage safely.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import KanbanBoard from "../src/pages/KanbanBoard.jsx";
import * as kanbanService from "../src/services/kanbanService.js";
import * as projectService from "../src/services/projectService.js";
import * as userService from "../src/services/userService.js";
import { io } from "socket.io-client";
import { AuthContext } from "../src/context/AuthContext";

// -----------------------------------------------------------------------------
// Mock firebase hooks
// -----------------------------------------------------------------------------
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: () => [{ getIdToken: jest.fn().mockResolvedValue("fake-token") }],
}));

// -----------------------------------------------------------------------------
// Mock services
// -----------------------------------------------------------------------------
jest.mock("../src/services/kanbanService.js", () => ({
  getKanbanColumns: jest.fn(),
  createKanbanTask: jest.fn(),
  updateKanbanTask: jest.fn(),
  deleteKanbanTask: jest.fn(),
  moveKanbanTask: jest.fn(),
}));

jest.mock("../src/services/projectService.js", () => ({
  getProjects: jest.fn(),
  getKanbanLists: jest.fn(),
}));

jest.mock("../src/services/userService.js", () => ({
  getPublicUsers: jest.fn(),
}));

// -----------------------------------------------------------------------------
// Mock socket.io
// -----------------------------------------------------------------------------
jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

/**
 * Utility function to render KanbanBoard with router and context.
 *
 * @param {JSX.Element} ui - The component to render.
 * @param {Object} options - Options for role, route, and user IDs.
 * @returns {RenderResult} Rendered component.
 */
const renderWithRouter = (
  ui,
  { route = "/projects/123", role = "manager", userMongoId = "dev1", firebaseUid = "firebase1" } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={{ role, userMongoId, firebaseUid }}>
        <Routes>
          <Route path="/projects/:id" element={ui} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

// -----------------------------------------------------------------------------
// Test suite
// -----------------------------------------------------------------------------
describe("KanbanBoard Component with role-based rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    projectService.getProjects.mockResolvedValue({
      projects: [{ _id: "p1", name: "Project A" }],
    });
    projectService.getKanbanLists.mockResolvedValue([{ _id: "l1", name: "List A" }]);
    userService.getPublicUsers.mockResolvedValue([{ _id: "u1", name: "User A" }]);
    kanbanService.deleteKanbanTask.mockResolvedValue({});
  });

  /**
   * @test Ensures that the "Create Kanban Task" button is rendered for managers.
   */
  test("renders 'Create Kanban Task' button if role=manager", async () => {
    renderWithRouter(<KanbanBoard />, { role: "manager" });
    await waitFor(() => {
      expect(screen.getByText(/Create Kanban Task/i)).toBeInTheDocument();
    });
  });

  /**
   * @test Ensures that socket events are registered correctly.
   */
  test("socket events update tasks", async () => {
    const mockSocket = { on: jest.fn(), off: jest.fn(), disconnect: jest.fn() };
    io.mockReturnValue(mockSocket);

    renderWithRouter(<KanbanBoard />, { role: "manager" });

    await waitFor(() => {
      expect(io).toHaveBeenCalled();
      expect(mockSocket.on).toHaveBeenCalledWith("connect", expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith("taskCreated", expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith("taskUpdated", expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith("taskDeleted", expect.any(Function));
    });
  });

  /**
   * @test Ensures that projects are loaded correctly.
   */
  test("loads projects correctly", async () => {
    renderWithRouter(<KanbanBoard />, { role: "manager" });
    await waitFor(() => {
      expect(projectService.getProjects).toHaveBeenCalled();
    });
  });

  /**
   * @test Ensures that lists are loaded correctly.
   */
  test("loads lists correctly", async () => {
    renderWithRouter(<KanbanBoard />, { role: "manager" });
    await waitFor(() => {
      expect(projectService.getKanbanLists).toHaveBeenCalled();
    });
  });

  /**
   * @test Ensures that public users are loaded correctly.
   */
  test("loads public users correctly", async () => {
    renderWithRouter(<KanbanBoard />, { role: "manager" });
    await waitFor(() => {
      expect(userService.getPublicUsers).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Additional safe tests to increase coverage
  // ---------------------------------------------------------------------------

  /**
   * @test Ensures that the initial progress text is rendered.
   */
  test("renders initial progress text", async () => {
    renderWithRouter(<KanbanBoard />, { role: "manager", route: "/projects/p1" });

    await waitFor(() => {
      expect(projectService.getProjects).toHaveBeenCalled();
    });

    expect(screen.getByText(/Overall progress/i)).toBeInTheDocument();
  });

  /**
   * @test Ensures that the Refresh button is rendered.
   */
  test("renders Refresh button", async () => {
    renderWithRouter(<KanbanBoard />, { role: "manager", route: "/projects/p1" });

    expect(screen.getByRole("button", { name: /Refresh/i })).toBeInTheDocument();
  });
});
