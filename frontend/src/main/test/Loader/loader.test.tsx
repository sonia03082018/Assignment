import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from "main/components/loader/Loader";

describe('Loader Component', () => {
    
    test('renders the loading spinner and Loading... text', ()=>{
        render(<Loader/>)
        const loadingText = screen.getByText(/Loading.../i);
        expect(loadingText).toBeInTheDocument();
        const spinnerElement = screen.getByRole('status');
        expect(spinnerElement).toBeInTheDocument();
        expect(spinnerElement).toHaveClass('animate-spin');
    })
});