create table Users
(
    UserId   int primary key,
    UserName varchar(255),
    Role     enum ('User','Chef','Admin'),
    PhoneNo  varchar(10),
    Address  varchar(511),
    Hash     binary(64)
);

create table Sections
(
    SectionId    int primary key,
    SectionName  varchar(255),
    SectionOrder int unique
);

/*create table Sub_Sections
(
    Sub_Section_id    int primary key,
    Section_id        int,
    Sub_Section_Name  varchar(255),
    Sub_Section_Order int unique
);*/

create table Items
(
    ItemId    int primary key,
    ItemName  varchar(255),
    SectionId int,
    Price     decimal,
    foreign key (SectionId) references Sections (SectionId)
);

create table Orders
(
    OrderId int primary key,
    UserId  int,
    Price   decimal,
    Paid    bool,
    foreign key (UserId) references Users (UserId)
);

create table Dishes
(
    DishId          int primary key,
    ItemId          int,
    OrderId         int,
    DishCount       int,
    SplInstructions text,
    Prepared        bool,
    foreign key (OrderId) references Orders (OrderId),
    foreign key (ItemId) references Items (ItemId)
);