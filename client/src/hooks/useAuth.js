import { useCallback } from 'react';
import authService from '../services/auth.service';
import useAuthStore from '../store/useAuth';

const useAuth = () => {
	const store = useAuthStore();

	const login = useCallback(async (payload) => {
		const { data } = await authService.login(payload);
		store.loginAction(data.data.user, data.data.token);
		return data.data;
	}, [store]);

	const logout = useCallback(() => {
		store.logoutAction();
	}, [store]);

	return {
		...store,
		login,
		logout,
	};
};

export default useAuth;
