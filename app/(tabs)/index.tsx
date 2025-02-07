
import { useCarFilter } from '@/context/useCarFilterContext';
import DashboardScreen from '../../components/Dashboard/DashboardScreen';
import CarFilterModal from '@/components/car/Modal';

export default function Dashboard() {
  const { filterOpen,setFilterOpen } = useCarFilter();

  return (<><DashboardScreen />
   {filterOpen && (
            <CarFilterModal onClose={() => setFilterOpen(false)} open={filterOpen} />
          )}
  </>)
}
