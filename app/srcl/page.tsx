import '@root/global-fonts.css';
import '@root/global.css';

import * as Constants from '@common/constants';
import * as Utilities from '@common/utilities';

// NOTE(jimmylee): This is a kitchen sink of all components.
// When forking or remixing, you'll likely only need a few.
import Accordion from '@components/Accordion';
import ActionBar from '@components/ActionBar';
import ActionButton from '@components/ActionButton';
import ActionListItem from '@components/ActionListItem';
import AlertBanner from '@components/AlertBanner';
import AS400 from '@components/examples/AS400';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import BarLoader from '@components/BarLoader';
import BarProgress from '@components/BarProgress';
import Block from '@components/Block';
import BlockLoader from '@components/BlockLoader';
import Breadcrumbs from '@components/BreadCrumbs';
import Button from '@components/Button';
import ButtonGroup from '@components/ButtonGroup';
import Card from '@components/Card';
import CardDouble from '@components/CardDouble';
import Checkbox from '@components/Checkbox';
import Chessboard from '@components/Chessboard';
import CodeBlock from '@components/CodeBlock';
import ContentFluid from '@components/ContentFluid';
import ComboBox from '@components/ComboBox';
import DataTable from '@components/DataTable';
import DatePicker from '@components/DatePicker';
import DashboardRadar from '@components/examples/DashboardRadar';
import DebugGrid from '@components/DebugGrid';
import DefaultActionBar from '@components/page/DefaultActionBar';
import DefaultLayout from '@components/page/DefaultLayout';
import Denabase from '@components/examples/Denabase';
import Dialog from '@components/Dialog';
import Divider from '@components/Divider';
import Drawer from '@components/Drawer';
import DropdownMenuTrigger from '@components/DropdownMenuTrigger';
import Grid from '@components/Grid';
import HoverComponentTrigger from '@components/HoverComponentTrigger';
import Indent from '@components/Indent';
import Input from '@components/Input';
import IntDevLogo from '@components/svg/IntDevLogo';
import ListItem from '@components/ListItem';
import Message from '@components/Message';
import MessageViewer from '@components/MessageViewer';
import MessagesInterface from '@components/examples/MessagesInterface';
import ModalAlert from '@components/modals/ModalAlert';
import ModalCanvasSnake from '@components/modals/ModalCanvasSnake';
import ModalCanvasPlatformer from '@components/modals/ModalCanvasPlatformer';
import ModalChess from '@components/modals/ModalChess';
import ModalCreateAccount from '@components/modals/ModalCreateAccount';
import ModalError from '@components/modals/ModalError';
import ModalMatrixModes from '@components/modals/ModalMatrixModes';
import ModalStack from '@components/ModalStack';
import ModalTrigger from '@components/ModalTrigger';
import Navigation from '@components/Navigation';
import NumberRangeSlider from '@components/NumberRangeSlider';
import Package from '@root/package.json';
import RadioButtonGroup from '@components/RadioButtonGroup';
import Row from '@components/Row';
import RowSpaceBetween from '@components/RowSpaceBetween';
import Script from 'next/script';
import Select from '@components/Select';
import SidebarLayout from '@components/SidebarLayout';
import Table from '@components/Table';
import TableRow from '@components/TableRow';
import TableColumn from '@components/TableColumn';
import Text from '@components/Text';
import TextArea from '@components/TextArea';
import TreeView from '@components/TreeView';
import UpdatingDataTable from '@components/examples/UpdatingDataTable';
import ModalDOMSnake from '@root/components/modals/ModalDOMSnake';

export const dynamic = 'force-static';

// NOTE(jimmylee)
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params, searchParams }) {
  const title = 'SRCL - Component Library';
  const description = Package.description;
  const url = 'https://sacred.computer/srcl';
  const handle = '@internetxstudio';

  return {
    description,
    icons: {
      apple: [{ url: '/apple-touch-icon.png' }, { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      icon: '/favicon-32x32.png',
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png',
        },
      ],
      shortcut: '/favicon-16x16.png',
    },
    metadataBase: new URL('https://sacred.computer'),
    openGraph: {
      description,
      images: [
        {
          url: 'https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/57a5715d-d332-47d0-8ec8-40cfa75bf36f.png',
          width: 1500,
          height: 785,
        },
      ],
      title,
      type: 'website',
      url,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      handle,
      images: ['https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/57a5715d-d332-47d0-8ec8-40cfa75bf36f.png'],
      title,
      url,
    },
    url,
  };
}

// NOTE(jimmylee)
// https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
export default async function Page(props) {
  return (
    <DefaultLayout previewPixelSRC="https://intdev-global.s3.us-west-2.amazonaws.com/template-app-icon.png">
      <br />
      <Grid>
        <Row>
          {Package.name.toUpperCase()} <Badge>{Package.version}</Badge>
        </Row>
        <Row>{Package.description}</Row>
      </Grid>

      <DebugGrid />
      <DefaultActionBar />

      <Grid>
        <ActionListItem icon={`⭢`} href="/">
          Go to Portfolio / Resume Page
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="/concept-1">
          View Concept I
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="/concept-2">
          View Concept II
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://internet.dev" target="_blank">
          Hire our studio to build your applications
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://github.com/internet-development/www-sacred" target="_blank">
          View the SRCL source code
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://vercel.com/home" target="_blank">
          Try our hosting provider Vercel
        </ActionListItem>
      </Grid>
      <Grid>
        <Accordion defaultValue={true} title="ACTION BAR">
          The action bar is a container for primary and secondary actions styled with a monospace font. Positioned at the top or bottom of an interface, it organizes elements like menu options, navigation buttons, titles, or search fields.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ActionBar
              items={[
                {
                  hotkey: '⌘+1',
                  body: 'Example I',
                },
                {
                  hotkey: '⌘+2',
                  body: 'Example II',
                },
                {
                  hotkey: '⌘+3',
                  body: 'Example III',
                },
              ]}
            />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ACCORDION">
          Accordion components are vertically stacked, expandable panels designed for efficient use of space in monospace-driven layouts, often inspired by classic terminal interfaces. Each panel consists of a header and its corresponding content area, allowing users to toggle between a condensed summary and detailed information.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Accordion defaultValue={false} title="ACCORDION EXAMPLE">
              There are two visions of America a half century from now. One is of a society more divided between the haves and the have-nots, a country in which the rich live in gated communities, send their children to expensive schools, and have access to first-rate medical care. Meanwhile, the rest live in a world marked by insecurity, at best mediocre education, and in effect rationed health care―they hope and pray they don't get seriously sick. At the bottom are millions of young people alienated and without hope. I have seen that picture in many developing countries; economists have given it a name, a dual economy, two societies living side by side, but hardly knowing each other, hardly imagining what life is like for the other. Whether we will fall to the depths of some countries, where the gates grow higher and the societies split farther and farther apart, I do not know. It is, however, the nightmare towards which we are slowly marching.
            </Accordion>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ACTION BUTTONS">
          Action buttons let users perform actions. They are used for task-based options within a workflow and work well in interfaces where buttons need to stay understated.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ActionButton hotkey="⌘+S">Save</ActionButton>
            <br />
            <ActionButton hotkey={<BlockLoader mode={9} />}>Loading</ActionButton>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ACTION LIST">
          Action lists are a vertical list of interactive actions or options. It displays items in a single-column format with space for icons, descriptions, side information, and other visuals. The monospace font ensures clarity and consistency.
          <br />
          <br />
          <Card title="EXAMPLE">
            <ActionListItem icon={`⭡`}>Hide item example</ActionListItem>
            <ActionListItem icon={`⭢`}>Next item example</ActionListItem>
            <ActionListItem icon={`⭣`}>Show item example</ActionListItem>
            <ActionListItem icon={`⭠`} href="/">
              Return item example
            </ActionListItem>
            <ActionListItem icon={`⊹`}>Action item example</ActionListItem>
            <ActionListItem icon={`⊹`} href="https://internet.dev" target="_blank">
              Visit the studio website
            </ActionListItem>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="ALERT BANNER">
          Alert banners display important messages across the user interface. It communicates system-wide issues, errors, warnings, or informational updates. Typically placed at the top of a page, it includes a clear message and may provide an action for the user. Alert Banners can be dismissed after being read, helping users stay informed about significant changes or information.
          <br />
          <br />
          <Card title="EXAMPLE">
            <AlertBanner>When things reach the extreme, they alternate to the opposite.</AlertBanner>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="APPLICATION SYSTEM/400 EXAMPLE">
          The Application System 400 (AS/400) is a line of servers and network adapters from IBM that was designed to help businesses manage their data, applications, and systems infrastructure. This usage example is a tribute to the interfaces those servers had.
          <br />
          <br />
          <AS400 />
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="AVATARS">
          Avatars identify users or entities in the interface. It can display an image, initials, or an icon, offering a visual connection to the user. Avatars appear in headers, comments, profiles, and messages. They provide quick recognition and add a personal touch to the digital experience.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Avatar src="https://pbs.twimg.com/profile_images/1958569334726668288/GFE8mhKI_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1748647089633169408/B7vd7ito_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1890125319224598528/ZILr9OGp_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1989080994687991809/CoUHUW0A_400x400.jpg" href="https://internet.dev" target="_blank" />

            <Avatar src="https://avatars.githubusercontent.com/u/10610892?v=4" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1987799435091529728/Rlbo90fX_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1992336125411950592/TzjQtKFk_400x400.jpg" href="https://internet.dev" target="_blank" />
            <Avatar src="https://pbs.twimg.com/profile_images/1925213285663805441/fUiKWlj2_400x400.jpg" href="https://internet.dev" target="_blank" />
            <br />
            <br />
            <Avatar src="https://pbs.twimg.com/profile_images/1958569334726668288/GFE8mhKI_400x400.jpg" href="https://x.com/aalimbuyuguen" target="_blank">
              <Indent>
                ANDREW ALIMBUYUGUEN
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1748647089633169408/B7vd7ito_400x400.jpg" href="https://x.com/ana_piligrim" target="_blank">
              <Indent>
                ANASTASIYA URALEVA
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1890125319224598528/ZILr9OGp_400x400.jpg" href="https://x.com/elijaharita" target="_blank">
              <Indent>
                ELIJAH SEED ARITA
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1989080994687991809/CoUHUW0A_400x400.jpg" href="https://x.com/caidanwilliams" target="_blank">
              <Indent>
                CAIDAN WILLIAMS
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1885454100223188993/6HXdKp9n_400x400.jpg" href="https://x.com/binary_fiddler" target="_blank">
              <Indent>
                CHENYU HUANG
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1987799435091529728/Rlbo90fX_400x400.jpg" href="https://x.com/hellohsuh" target="_blank">
              <Indent>
                HANNAH SUH
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1992336125411950592/TzjQtKFk_400x400.jpg" href="https://x.com/LouanneMMurphy" target="_blank">
              <Indent>
                LOUANNE MURPHY
                <br />
                Webmaster
              </Indent>
            </Avatar>
            <Avatar src="https://pbs.twimg.com/profile_images/1925213285663805441/fUiKWlj2_400x400.jpg" href="https://x.com/wwwjim" target="_blank">
              <Indent>
                JIMMY LEE
                <br />
                Staff Janitor
              </Indent>
            </Avatar>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BADGES">
          Badges communicate status, notification counts, or attribute labels. Typically circular or pill-shaped, they display a number or short text, often overlaid on an icon or element. Badges highlight updates, unread messages, or categorize items with status indicators. They provide critical information at a glance, improving navigation and user engagement.
          <br />
          <br />
          <Card title="EXAMPLE">
            <Badge>Example</Badge>
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BAR LOADER">
          A long loader is a visual element that signals ongoing activity or progress, reassuring users that a task is being processed. Commonly used during actions like data fetching or file uploads, it provides feedback to reduce uncertainty.
          <br />
          <br />
          <Card title="EXAMPLE">
            <BarLoader intervalRate={1000} />
            <BarLoader intervalRate={100} />
            <BarLoader progress={50} />
            <BarLoader progress={100} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="BLOCK LOADER">
          A block loader is a visual indicator that signals ongoing activity or progress while occupying only a single character of space. It reassures users that a task is being processed or that activity is occurring.
          <br />
          <br />
          <Card title="EXAMPLE">
            <BlockLoader mode={0} />
            <br />
            <BlockLoader mode={1} />
            <br />
            <BlockLoader mode={2} />
            <br />
            <BlockLoader mode={3} />
            <br />
            <BlockLoader mode={4} />
            <br />
            <BlockLoader mode={5} />
            <br />
            <BlockLoader mode={6} />
            <br />
            <BlockLoader mode={7} />
            <br />
            <BlockLoader mode={8} />
            <br />
            <BlockLoader mode={9} />
            <br />
            <BlockLoader mode={10} />
            <br />
            <BlockLoader mode={11} />
          </Card>
          <br />
        </Accordion>

        <Accordion defaultValue={true} title="MORE COMPONENTS">
          For brevity, this page shows a subset of components. Visit the full SRCL library for more examples including:
          <br />
          <br />
          <ul>
            <ListItem>Blog Post layouts</ListItem>
            <ListItem>Breadcrumbs</ListItem>
            <ListItem>Buttons & Button Groups</ListItem>
            <ListItem>Cards</ListItem>
            <ListItem>Checkboxes</ListItem>
            <ListItem>Chessboard</ListItem>
            <ListItem>Code Blocks</ListItem>
            <ListItem>Combobox</ListItem>
            <ListItem>Data Tables</ListItem>
            <ListItem>Date Picker</ListItem>
            <ListItem>Dashboard Radar</ListItem>
            <ListItem>Denabase</ListItem>
            <ListItem>Dialogs</ListItem>
            <ListItem>Dividers</ListItem>
            <ListItem>Drawers</ListItem>
            <ListItem>Dropdown Menus</ListItem>
            <ListItem>Forms & Inputs</ListItem>
            <ListItem>Links & Lists</ListItem>
            <ListItem>Messages</ListItem>
            <ListItem>Modals</ListItem>
            <ListItem>Navigation Bars</ListItem>
            <ListItem>Popovers</ListItem>
            <ListItem>Progress Bars</ListItem>
            <ListItem>Radio Buttons</ListItem>
            <ListItem>Select</ListItem>
            <ListItem>Sidebars</ListItem>
            <ListItem>Sliders</ListItem>
            <ListItem>Tables</ListItem>
            <ListItem>Text Areas</ListItem>
            <ListItem>Tooltips</ListItem>
            <ListItem>Tree Views</ListItem>
          </ul>
          <br />
        </Accordion>
      </Grid>

      <Grid>
        <ActionListItem icon={`⭢`} href="/">
          Back to Portfolio
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://internet.dev" target="_blank">
          Hire our studio to build your applications
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://github.com/internet-development/www-sacred" target="_blank">
          View the SRCL source code
        </ActionListItem>
        <ActionListItem icon={`⭢`} href="https://vercel.com/home" target="_blank">
          Try our hosting provider Vercel
        </ActionListItem>
      </Grid>
      <ModalStack />
    </DefaultLayout>
  );
}

