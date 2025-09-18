import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import LoginPage from "@/app/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLogin } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

// mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: pushMock,
});

// mock the useLogin hook so we dont hit the API
jest.mock("@/lib/api/auth", () => ({
  useLogin: jest.fn(),
}));

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </Provider>
  );
}

describe("LoginPage", () => {
  it("submits login form and dispatches auth", async () => {
    const mockMutate = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    });

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "adminpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { username: "admin", password: "adminpass" },
        expect.any(Object)
      );
    });
  });
});
