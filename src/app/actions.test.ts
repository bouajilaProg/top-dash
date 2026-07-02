import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getApps, addApp, deleteApp } from "./actions";
import { promises as fs } from "fs";

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

const mockReadFile = fs.readFile as ReturnType<typeof vi.fn>;
const mockWriteFile = fs.writeFile as ReturnType<typeof vi.fn>;

describe("actions", () => {
  const seedApps = [
    {
      id: "portfolio",
      name: "Portfolio",
      icon: { type: "icon", name: "Briefcase" },
      url: "https://bouajila.com",
      position: 0,
      bgColor: "#0ea5e9",
    },
    {
      id: "admin",
      name: "Admin",
      icon: { type: "icon", name: "Shield" },
      url: "https://dokploy.bouajila.top",
      position: 5,
      bgColor: "#ef4444",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getApps", () => {
    it("returns parsed apps from file", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(seedApps));
      const result = await getApps();
      expect(result).toEqual(seedApps);
      expect(mockReadFile).toHaveBeenCalledTimes(1);
    });
  });

  describe("addApp", () => {
    it("adds a valid app and assigns next position", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(seedApps));
      mockWriteFile.mockResolvedValueOnce(undefined);

      const formData = new FormData();
      formData.append("name", "New App");
      formData.append("url", "https://example.com");
      formData.append("iconName", "Globe");
      formData.append("bgColor", "#0ea5e9");

      const result = await addApp(formData);

      expect(result.success).toBe(true);
      expect(result.app).toBeDefined();
      expect(result.app!.name).toBe("New App");
      expect(result.app!.position).toBe(6); // max position of seed is 5
      expect(result.app!.icon).toEqual({ type: "icon", name: "Globe" });
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
    });

    it("rejects empty name", async () => {
      const formData = new FormData();
      formData.append("name", "");
      formData.append("url", "https://example.com");
      formData.append("iconName", "Globe");
      formData.append("bgColor", "#0ea5e9");

      const result = await addApp(formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Name is required");
    });

    it("rejects invalid url", async () => {
      const formData = new FormData();
      formData.append("name", "Test");
      formData.append("url", "not-a-url");
      formData.append("iconName", "Globe");
      formData.append("bgColor", "#0ea5e9");

      const result = await addApp(formData);
      expect(result.success).toBe(false);
      expect(result.error).toContain("Valid URL");
    });

    it("rejects invalid icon", async () => {
      const formData = new FormData();
      formData.append("name", "Test");
      formData.append("url", "https://example.com");
      formData.append("iconName", "InvalidIcon");
      formData.append("bgColor", "#0ea5e9");

      const result = await addApp(formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid icon selection");
    });

    it("rejects invalid color", async () => {
      const formData = new FormData();
      formData.append("name", "Test");
      formData.append("url", "https://example.com");
      formData.append("iconName", "Globe");
      formData.append("bgColor", "#zzzzzz");

      const result = await addApp(formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid color selection");
    });
  });

  describe("deleteApp", () => {
    it("removes an app by id", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(seedApps));
      mockWriteFile.mockResolvedValueOnce(undefined);

      const formData = new FormData();
      formData.append("id", "admin");

      const result = await deleteApp(formData);

      expect(result.success).toBe(true);
      const written = JSON.parse(mockWriteFile.mock.calls[0][1]);
      expect(written).toHaveLength(1);
      expect(written[0].id).toBe("portfolio");
    });

    it("returns error when id not found", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(seedApps));

      const formData = new FormData();
      formData.append("id", "nonexistent");

      const result = await deleteApp(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("App not found");
    });

    it("rejects missing id", async () => {
      const formData = new FormData();
      const result = await deleteApp(formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe("ID is required");
    });
  });
});
