import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UsersTable from '@/components/tables/users.table'
import HousesTable from '@/components/tables/houses.table'
import FeedbacksTable from '@/components/tables/feedbacks.table'

export default function Dashboard() {
  return (
    <div className='mt-[10vh] min-h-[90vh]'>
      <div className='container'>
        <Tabs defaultValue='users' className='py-4'>
          <TabsList className='grid h-12 w-full grid-cols-3 text-xl'>
            <TabsTrigger value='users' className='py-2'>
              Users
            </TabsTrigger>
            <TabsTrigger value='houses' className='py-2'>
              Houses
            </TabsTrigger>
            <TabsTrigger value='feedbacks' className='py-2'>
              Feedbacks
            </TabsTrigger>
          </TabsList>
          <TabsContent value='users' className='py-4'>
            <UsersTable />
          </TabsContent>
          <TabsContent value='houses' className='py-4'>
            <HousesTable />
          </TabsContent>
          <TabsContent value='feedbacks' className='py-4'>
            <FeedbacksTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
