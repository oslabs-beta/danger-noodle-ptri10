import React from "react";
import FieldsBtn from './FieldsBtn';
import Card from '@mui/material/Card';
import { DisplayData } from "./DisplayData";
//import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
//import Button from '@mui/material/Button';
//import Typography from '@mui/material/Typography';

const QueryCard = (props: any) => {
  return (
    <>
      <div className="m-1 p-1 border-2" style={{ width: '250px' }}>
             <>
              <Card className='query-card' sx={{ minWidth: 200, border: '1px solid black', width: 1/8 }}>
                <CardContent>
                  <div>
                    <FieldsBtn result={props.type.name} />
                   </div>
                </CardContent>
              </Card>
            </>
      </div>
    </>
  );
};

export default QueryCard;